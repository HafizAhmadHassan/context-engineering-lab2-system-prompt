#!/bin/bash
set -euo pipefail

REPO_URL="https://github.com/HafizAhmadHassan/context-engineering-lab2-system-prompt.git"
AUTHOR_NAME="Hafiz Ahmad Hassan"
AUTHOR_EMAIL="ahmadhassan061@gmail.com"

npm run build

COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "static")
COMMIT_MSG=$(git log -1 --pretty=%B 2>/dev/null | head -1 || echo "deploy")

cd dist
touch .nojekyll

if [ ! -d .git ]; then
  git init -b gh-pages -q
fi
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git config user.name "$AUTHOR_NAME"
git config user.email "$AUTHOR_EMAIL"
git add -A
git commit -q -m "Deploy ${COMMIT_SHA}: ${COMMIT_MSG}" || echo "no changes to deploy"

# Optional token auth: GITHUB_TOKEN=<token> ./deploy.sh
# Otherwise relies on existing git credentials / credential helper.
if [ -n "${GITHUB_TOKEN:-}" ]; then
  PUSH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/HafizAhmadHassan/context-engineering-lab2-system-prompt.git"
  git push -f "$PUSH_URL" gh-pages
else
  git push -f origin gh-pages
fi

echo ""
echo "Deployed to https://hafizahmadhassan.github.io/context-engineering-lab2-system-prompt/"