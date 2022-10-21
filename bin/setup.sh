#!/usr/bin/env bash
#
# A simple script for setting up your local development environment.
#
SELF="${BASH_SOURCE[0]}"
BIN_DIR="$(cd "$(dirname "$SELF")" && pwd)"
APP_DIR="$(dirname "$BIN_DIR")"

cd "$APP_DIR" || exit $?
set -E

init(){
  yarn install --frozen-lockfile
  yarn db:generate build

  cd apps/next-app
  yarn prisma db push --accept-data-loss
  yarn prisma db seed
}

init
