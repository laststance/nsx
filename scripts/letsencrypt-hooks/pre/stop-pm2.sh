#!/bin/bash
# Stop the NSX Express process so certbot standalone can bind port 80.
# Snap's certbot.renew timer does not use HOME=/root. Without PM2_HOME this
# would talk to a different (empty) PM2 daemon and leave production listening.
set -euo pipefail

export HOME=/root
export PM2_HOME=/root/.pm2

HTTP_PORT=80
PM2_STOP_WAIT_SECONDS=3

/usr/bin/pm2 stop server

# Express can take a moment to release the socket after pm2 reports stopped.
sleep "$PM2_STOP_WAIT_SECONDS"
if [ -n "$(/usr/bin/ss -H -lntp "sport = :${HTTP_PORT}")" ]; then
  echo "port ${HTTP_PORT} is still in use after pm2 stop" >&2
  exit 1
fi
