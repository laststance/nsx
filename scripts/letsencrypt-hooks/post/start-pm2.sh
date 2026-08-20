#!/bin/bash
# Start the NSX Express process after a certbot renewal attempt.
# Runs on success and failure so the site comes back even when renewal fails.
# PM2_HOME is pinned because Snap's certbot.renew timer does not use HOME=/root.
set -euo pipefail

PM2_HOOK_ENV=/etc/letsencrypt/renewal-hooks/pm2.env
if [ -f "$PM2_HOOK_ENV" ]; then
  # Ansible writes HOME and PM2_HOME for the live PM2 daemon.
  set -a
  # shellcheck disable=SC1091
  . "$PM2_HOOK_ENV"
  set +a
fi

export HOME="${HOME:-/root}"
export PM2_HOME="${PM2_HOME:-/root/.pm2}"

/usr/bin/pm2 start server
