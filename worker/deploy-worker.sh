#!/bin/bash
set -euo pipefail

echo "Deploying Cloudflare API proxy worker..."
cd "$(dirname "$0")"
npx wrangler deploy

echo ""
echo "Deployed. Now set WORKER_URL in ../src/utils/api.js to the URL shown above,"
echo "then rebuild and redeploy the site."
