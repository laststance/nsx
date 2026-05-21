#!/bin/bash
# certbot post-hook: start PM2 server after the renewal attempt finishes.
# Runs as root regardless of renewal success/failure, so the service always comes
# back up. Absolute pm2 path required because renewal-hook PATH is minimal.
/usr/bin/pm2 start server
