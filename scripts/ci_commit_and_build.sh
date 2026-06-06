#!/usr/bin/env bash
set -euo pipefail

# ci_commit_and_build.sh
# Usage: run from repository root: ./scripts/ci_commit_and_build.sh

ROOT=$(pwd)
echo "Running in: $ROOT"

BRANCH=${1:-adsense-fixes}
echo "Using branch: $BRANCH"

git switch -c "$BRANCH" || git switch "$BRANCH"

echo "Installing dependencies..."
npm install

echo "Building site..."
npm run build

echo "Staging core changes..."
git add src/content/tools/bat.md src/content/tools/fzf.md src/content/tools/vim.md src/layouts/Layout.astro src/layouts/ToolLayout.astro src/components/NavBar.astro src/pages/privacy.astro src/pages/contact.astro
git commit -m "Enhance: add practical examples, metadata; add privacy/contact; improve layout/navigation"

declare -a tools=(gh awscli curl colima jq mise tmux htop nginx)
for tool in "${tools[@]}"; do
  file="src/content/tools/${tool}.md"
  if [[ -f "$file" ]]; then
    git add "$file"
    git commit -m "Add tool: ${tool}"
  else
    echo "Warning: $file not found, skipping commit for ${tool}"
  fi
done

echo "All commits created on branch $BRANCH. You can now push with:'git push -u origin $BRANCH'"
echo "Done."
