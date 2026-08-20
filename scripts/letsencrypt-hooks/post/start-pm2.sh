#!/bin/bash
# Start the NSX Express process after a certbot renewal attempt.
# Runs on success and failure so the site comes back even when renewal fails.
# PM2_HOME is pinned because Snap's certbot.renew timer does not use HOME=/root.
set -euo pipefail

export HOME=/root
export PM2_HOME=/root/.pm2

/usr/bin/pm2 start server
