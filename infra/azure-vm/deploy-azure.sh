#!/usr/bin/env bash

set -euo pipefail

RESOURCE_GROUP="${RESOURCE_GROUP:-rg-smart-workspace-dev-malaysiawest}"
LOCATION="${LOCATION:-malaysiawest}"
VM_NAME="${VM_NAME:-vm-smart-workspace}"
VM_SIZE="${VM_SIZE:-Standard_DS1_v2}"
ADMIN_USERNAME="${ADMIN_USERNAME:-azureuser}"

SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLOUD_INIT_TEMPLATE="${SCRIPT_DIRECTORY}/cloud-init.yml"

if [[ ! -f "${CLOUD_INIT_TEMPLATE}" ]]; then
  echo "Khong tim thay file: ${CLOUD_INIT_TEMPLATE}"
  exit 1
fi

RANDOM_SUFFIX="$(openssl rand -hex 3)"
DNS_LABEL="${DNS_LABEL:-smart-workspace-${RANDOM_SUFFIX}}"

PUBLIC_HOST="${DNS_LABEL}.${LOCATION}.cloudapp.azure.com"
PUBLIC_URL="http://${PUBLIC_HOST}"

RENDERED_CLOUD_INIT="$(mktemp)"
trap 'rm -f "${RENDERED_CLOUD_INIT}"' EXIT

sed \
  "s|__PUBLIC_URL__|${PUBLIC_URL}|g" \
  "${CLOUD_INIT_TEMPLATE}" \
  > "${RENDERED_CLOUD_INIT}"

echo "============================================"
echo "Resource Group : ${RESOURCE_GROUP}"
echo "Location       : ${LOCATION}"
echo "VM             : ${VM_NAME}"
echo "VM Size        : ${VM_SIZE}"
echo "Public URL     : ${PUBLIC_URL}"
echo "============================================"

echo "Tao Resource Group..."

az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --output none

echo "Tao Ubuntu VM va chay cloud-init..."

az vm create \
  --resource-group "${RESOURCE_GROUP}" \
  --name "${VM_NAME}" \
  --location "${LOCATION}" \
  --image Ubuntu2204 \
  --size "${VM_SIZE}" \
  --admin-username "${ADMIN_USERNAME}" \
  --generate-ssh-keys \
  --public-ip-address-dns-name "${DNS_LABEL}" \
  --os-disk-size-gb 64 \
  --custom-data "${RENDERED_CLOUD_INIT}" \
  --output none

echo "Mo port HTTP 80..."

az vm open-port \
  --resource-group "${RESOURCE_GROUP}" \
  --name "${VM_NAME}" \
  --port 80 \
  --priority 1001 \
  --output none

echo "Cho cloud-init cai Docker, build va chay ung dung..."

az vm run-command invoke \
  --resource-group "${RESOURCE_GROUP}" \
  --name "${VM_NAME}" \
  --command-id RunShellScript \
  --scripts '
    cloud-init status --wait

    if [ ! -f /var/lib/smart-workspace-deploy.done ]; then
      echo "Deployment chua hoan thanh hoac da bi loi."
      echo ""
      tail -n 200 /var/log/smart-workspace-deploy.log
      exit 1
    fi

    cd /opt/smart-workspace

    echo "=== Docker Compose Status ==="
    docker compose ps

    echo ""
    echo "=== Backend Last Logs ==="
    docker compose logs --tail=50 backend
  ' \
  --query "value[0].message" \
  --output tsv

echo ""
echo "============================================"
echo "SMART WORKSPACE DEPLOY THANH CONG"
echo "============================================"
echo "Website: ${PUBLIC_URL}"
echo "Admin:   ${PUBLIC_URL}/admin"
echo "API:     ${PUBLIC_URL}/api/products"
echo ""
