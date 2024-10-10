#!/bin/bash
chmod +x run.sh

echo "Running migrations ..."

pnpm -F @fs/prisma migrate:dev

pnpm install

pnpm run dev