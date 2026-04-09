terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }

  backend "azurerm" {
    subscription_id      = "ce9f377e-cfe1-4360-aae4-e40f72ce1280"
    resource_group_name  = "rowsafe-tfstate-rg"
    storage_account_name = "rowsafetfstate"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = "ce9f377e-cfe1-4360-aae4-e40f72ce1280"
}

locals {
  prefix = "${var.project_name}-${var.environment}"
  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ─────────────────────────────────────────────
# Resource Group
# ─────────────────────────────────────────────
resource "azurerm_resource_group" "main" {
  name     = "${local.prefix}-rg"
  location = var.location
  tags     = local.tags
}

# ─────────────────────────────────────────────
# Container Registry
# ─────────────────────────────────────────────
resource "azurerm_container_registry" "acr" {
  name                = replace("${local.prefix}acr", "-", "")
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
  tags                = local.tags
}

# ─────────────────────────────────────────────
# PostgreSQL Flexible Server
# ─────────────────────────────────────────────
resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "${local.prefix}-db"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "16"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  sku_name               = var.db_sku
  storage_mb             = var.db_storage_mb
  zone                   = "2"

  authentication {
    active_directory_auth_enabled = false
    password_auth_enabled         = true
  }

  tags = local.tags
}

resource "azurerm_postgresql_flexible_server_database" "app" {
  name      = "${var.project_name}_${var.environment}"
  server_id = azurerm_postgresql_flexible_server.db.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# ─────────────────────────────────────────────
# App Service Plan
# ─────────────────────────────────────────────
resource "azurerm_service_plan" "main" {
  name                = "${local.prefix}-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_sku
  tags                = local.tags
}

# ─────────────────────────────────────────────
# Web App (Next.js)
# ─────────────────────────────────────────────
resource "azurerm_linux_web_app" "app" {
  name                = "${local.prefix}-app"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true
  tags                = local.tags

  site_config {
    always_on                               = var.app_sku == "F1" ? false : true
    container_registry_use_managed_identity = false
    health_check_path                       = "/"

    application_stack {
      docker_registry_url      = "https://${azurerm_container_registry.acr.login_server}"
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
      docker_image_name        = "rowsafe:latest"
    }
  }

  app_settings = {
    WEBSITES_PORT                       = "3000"
    WEBSITES_CONTAINER_START_TIME_LIMIT = "180"

    DATABASE_URL = "postgresql://${var.db_admin_username}:${var.db_admin_password}@${azurerm_postgresql_flexible_server.db.fqdn}:5432/${azurerm_postgresql_flexible_server_database.app.name}?sslmode=require"

    AUTH_SECRET = var.auth_secret
    AUTH_URL    = "https://${local.prefix}-app.azurewebsites.net"

    OPENAI_API_KEY = var.openai_api_key
    RESEND_API_KEY = var.resend_api_key
    EMAIL_FROM     = var.email_from
  }
}

# ─────────────────────────────────────────────
# Custom Domain (optional)
# ─────────────────────────────────────────────
resource "azurerm_app_service_custom_hostname_binding" "app_custom" {
  count               = var.custom_domain != "" ? 1 : 0
  hostname            = var.custom_domain
  app_service_name    = azurerm_linux_web_app.app.name
  resource_group_name = azurerm_resource_group.main.name
}
