#!/usr/bin/env bash
set -e

# Load env vars
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Start dev services
npx concurrently \
  "yarn start:postgres" \
  "yarn start:redis" \
  "nodemon" \
  "nodemon -x 'tsoa spec-and-routes -c tsoa.json'"
