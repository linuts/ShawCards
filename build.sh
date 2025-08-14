#!/usr/bin/env bash
set -e

OUTPUT_DIR="build"
mkdir -p "$OUTPUT_DIR"

PLATFORMS=("linux" "darwin" "windows")
ARCH="amd64"

for GOOS in "${PLATFORMS[@]}"; do
  echo "Building for $GOOS/$ARCH..."
  EXT=""
  if [ "$GOOS" = "windows" ]; then
    EXT=".exe"
  fi
  env GOOS="$GOOS" GOARCH="$ARCH" CGO_ENABLED=0 go build -o "$OUTPUT_DIR/shawcards_${GOOS}_${ARCH}${EXT}" main.go
done
