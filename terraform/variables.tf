variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "rowsafe"
}

variable "environment" {
  description = "Deployment environment (staging, production)"
  type        = string
  default     = "production"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "uksouth"
}

# ── Database ──

variable "db_admin_username" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "rowsafeadmin"
}

variable "db_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}

variable "db_sku" {
  description = "PostgreSQL Flexible Server SKU"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "db_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 32768
}

# ── Auth ──

variable "auth_secret" {
  description = "Auth.js secret (min 32 chars, generate with: openssl rand -base64 32)"
  type        = string
  sensitive   = true
}

# ── App Service ──

variable "app_sku" {
  description = "App Service Plan SKU (B1, P1v3, etc.)"
  type        = string
  default     = "B1"
}

# ── Optional integrations ──

variable "openai_api_key" {
  description = "OpenAI API key for AI features (optional)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "resend_api_key" {
  description = "Resend API key for email (optional)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "email_from" {
  description = "From address for emails"
  type        = string
  default     = "Welfare <onboarding@resend.dev>"
}

# ── Custom Domain (optional) ──

variable "custom_domain" {
  description = "Custom domain for the web app (optional)"
  type        = string
  default     = ""
}
