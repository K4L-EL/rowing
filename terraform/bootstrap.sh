#!/usr/bin/env bash
set -euo pipefail

# Creates the Azure storage account used for Terraform remote state.
# Run this ONCE before the first `terraform init`.

SUBSCRIPTION_ID="ce9f377e-cfe1-4360-aae4-e40f72ce1280"
RG_NAME="rowsafe-tfstate-rg"
SA_NAME="rowsafetfstate"
CONTAINER_NAME="tfstate"
LOCATION="uksouth"

echo "Setting subscription..."
az account set --subscription "$SUBSCRIPTION_ID"

echo "Creating resource group for tfstate..."
az group create --name "$RG_NAME" --location "$LOCATION" --output none

echo "Creating storage account..."
az storage account create \
  --name "$SA_NAME" \
  --resource-group "$RG_NAME" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --output none

echo "Creating blob container..."
az storage container create \
  --name "$CONTAINER_NAME" \
  --account-name "$SA_NAME" \
  --output none

echo ""
echo "Done. You can now run:"
echo "  cd terraform"
echo "  terraform init"
echo "  terraform plan -var-file=terraform.tfvars"
echo "  terraform apply -var-file=terraform.tfvars"
