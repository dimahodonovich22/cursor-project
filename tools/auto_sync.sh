#!/usr/bin/env bash
set -euo pipefail

# Auto-commit and push changes in this repo on an interval.
# Usage: INTERVAL=30 ./tools/auto_sync.sh [branch]

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

BRANCH="${1:-main}"
INTERVAL="${INTERVAL:-30}"

# Determine active branch if provided branch doesn't exist yet
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || echo main)"
fi

echo "[auto-sync] Running in $REPO_DIR on branch '$BRANCH' every ${INTERVAL}s" >&2

while true; do
  # Detect changes (tracked or untracked)
  if ! git diff --quiet --ignore-submodules HEAD -- 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    git add -A
    if ! git diff --staged --quiet; then
      msg="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S %Z')"
      git commit -m "$msg" || true
      # Rebase pull to avoid diverging history if remote changed upstream
      git pull --rebase --autostash --no-edit origin "$BRANCH" 2>/dev/null || true
      git push origin "$BRANCH" || true
    fi
  fi
  sleep "$INTERVAL"
done

