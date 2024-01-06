#!/usr/bin/env bash
set -Eeuo pipefail # DISABLE_PRESUBMIT_CHECK

# list all files excluding files & directories specified in .gitignore

set -o noglob # Disable * to handle arg inputs like '*package.json'

# shellcheck disable=SC2068  # No double quote on $@ is intended as we're executing them as they are.
git ls-files $@ -co --exclude-standard | sort | comm -23 - <(git ls-files -d | sort)
