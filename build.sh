#!/usr/bin/env bash
set -e

OUTPUT_DIR="build"
mkdir -p "$OUTPUT_DIR"

PLATFORMS=("linux" "darwin" "windows")
ARCHS=("amd64" "arm64")

for GOOS in "${PLATFORMS[@]}"; do
  for GOARCH in "${ARCHS[@]}"; do
    echo "Building for $GOOS/$GOARCH..."
    EXT=""
    if [ "$GOOS" = "windows" ]; then
      EXT=".exe"
    fi
    env GOOS="$GOOS" GOARCH="$GOARCH" CGO_ENABLED=0 go build -o "$OUTPUT_DIR/shawcards_${GOOS}_${GOARCH}${EXT}" main.go
  done
done
