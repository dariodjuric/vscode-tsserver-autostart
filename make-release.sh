#!/usr/bin/env bash
# Set the extension version and build the .vsix package.
# Usage: ./make-release.sh <version>
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

version="$1"
cd "$(dirname "$0")"

# Write the version to package.json. Do not make a git commit or tag.
npm version "$version" --no-git-tag-version --allow-same-version >/dev/null

npx --yes @vscode/vsce package

echo "Package: tsserver-autostart-$(node -p 'require("./package.json").version').vsix"
