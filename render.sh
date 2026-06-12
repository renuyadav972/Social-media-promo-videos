#!/bin/bash
# Self-contained renderer for this project — works even without Node installed.
# Usage:  ./render.sh                 # renders VibePromoNative
#         ./render.sh VibePromo       # render a different composition
#         ./render.sh PlivoLogo out/logo.mp4
set -e
cd "$(dirname "$0")"

COMP="${1:-VibePromoNative}"
OUT="${2:-out/${COMP}.mp4}"

# 1) Find a Node runtime: system node, a previously-downloaded one, or fetch it.
NODE_VER="v20.18.1"
NODE_DIR="/tmp/node-${NODE_VER}-darwin-arm64"
if command -v node >/dev/null 2>&1; then
  NODE="$(command -v node)"
elif [ -x "${NODE_DIR}/bin/node" ]; then
  NODE="${NODE_DIR}/bin/node"
else
  echo "Node not found — downloading a standalone ${NODE_VER} (arm64)…"
  ARCH="$(uname -m)"; [ "$ARCH" = "x86_64" ] && ARCH="x64" || ARCH="arm64"
  NODE_DIR="/tmp/node-${NODE_VER}-darwin-${ARCH}"
  curl -L --fail -o /tmp/node.tar.gz "https://nodejs.org/dist/${NODE_VER}/node-${NODE_VER}-darwin-${ARCH}.tar.gz"
  tar -xzf /tmp/node.tar.gz -C /tmp
  NODE="${NODE_DIR}/bin/node"
fi
echo "Using node: $($NODE -v)"

# 2) Make sure the bundled native binaries are runnable (copied node_modules
#    can lose the +x bit and carry a Gatekeeper quarantine flag).
chmod +x node_modules/@esbuild/darwin-arm64/bin/esbuild 2>/dev/null || true
chmod +x node_modules/@remotion/compositor-darwin-arm64/{remotion,ffmpeg,ffprobe} 2>/dev/null || true
find node_modules/.remotion -name 'chrome-headless-shell' -exec chmod +x {} \; 2>/dev/null || true
xattr -dr com.apple.quarantine node_modules/@esbuild node_modules/@remotion/compositor-darwin-arm64 node_modules/.remotion 2>/dev/null || true

# 3) Render.
echo "Rendering ${COMP} -> ${OUT}"
"$NODE" node_modules/@remotion/cli/remotion-cli.js render src/index.ts "${COMP}" "${OUT}" --log=info
echo "Done: ${OUT}"
