#!/bin/sh

rimraf dist/
rimraf dist-tsc/

esbuild src/index.ts --bundle --outdir=dist --platform=node --format=esm --external:./node_modules/*
pnpm ui:build
pnpm exec prisma migrate dev --name init
