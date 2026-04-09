#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 [--env production] [--skip-migrate]"
  echo ""
  echo "Builds and pushes Docker image to ACR, deploys to Azure App Service,"
  echo "and runs Prisma migrations against the production database."
  echo ""
  echo "Prerequisites:"
  echo "  - Azure CLI logged in (az login)"
  echo "  - Docker running"
  echo "  - Terraform applied (cd terraform && terraform apply)"
  echo ""
  echo "Options:"
  echo "  --env <env>      Environment (default: production)"
  echo "  --skip-migrate   Skip running prisma migrate deploy"
  echo ""
  echo "Examples:"
  echo "  $0"
  echo "  $0 --env staging"
  echo "  $0 --skip-migrate"
  exit 1
}

ENV="production"
SKIP_MIGRATE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env|-e) ENV="$2"; shift 2;;
    --skip-migrate) SKIP_MIGRATE=true; shift;;
    -h|--help) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

PREFIX="rowsafe-${ENV}"
RG="${PREFIX}-rg"
APP_NAME="${PREFIX}-app"

require_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Missing command: $1" >&2; exit 1; }; }
require_cmd az
require_cmd docker
require_cmd git
require_cmd npx

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "WARNING: Uncommitted changes present."
  read -rp "Continue anyway? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || exit 1
fi

SHA=$(git rev-parse --short=12 HEAD)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

ACR_SERVER=$(cd terraform && terraform output -raw acr_login_server 2>/dev/null || echo "")
if [[ -z "$ACR_SERVER" ]]; then
  echo "Could not read ACR login server from Terraform outputs."
  echo "Make sure you've run 'terraform apply' first."
  exit 1
fi

echo "Logging in to ACR: ${ACR_SERVER}..."
az acr login --name "${ACR_SERVER%%.*}"

IMAGE="${ACR_SERVER}/rowsafe"
TAG="${TIMESTAMP}-${SHA}"

echo ""
echo "Building image..."
docker build \
  -t "${IMAGE}:${TAG}" \
  -t "${IMAGE}:latest" \
  .

echo "Pushing image..."
docker push "${IMAGE}:${TAG}"
docker push "${IMAGE}:latest"

echo "Deploying to App Service..."
az webapp config container set \
  --resource-group "$RG" \
  --name "$APP_NAME" \
  --docker-custom-image-name "${IMAGE}:${TAG}" \
  --docker-registry-server-url "https://${ACR_SERVER}" \
  --output none

az webapp restart --resource-group "$RG" --name "$APP_NAME" --output none

echo "App deployed: ${IMAGE}:${TAG}"

if [[ "$SKIP_MIGRATE" == false ]]; then
  echo ""
  echo "Running Prisma migrations..."
  DATABASE_URL=$(cd terraform && terraform output -raw database_url 2>/dev/null || echo "")
  if [[ -z "$DATABASE_URL" ]]; then
    echo "WARNING: Could not read database_url from Terraform outputs — skipping migrations."
  else
    DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy
    echo "Migrations applied."
  fi
fi

APP_URL=$(cd terraform && terraform output -raw app_url 2>/dev/null || echo "https://${APP_NAME}.azurewebsites.net")

echo ""
echo "Deployment complete — ${TIMESTAMP}"
echo ""
echo "  App: ${APP_URL}"
echo "  Image: ${IMAGE}:${TAG}"
