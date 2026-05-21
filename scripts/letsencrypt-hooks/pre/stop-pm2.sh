#!/bin/bash
# certbot pre-hook: stop PM2 server to free port 80 for the standalone authenticator.
# Runs as root before every renewal attempt. Absolute pm2 path required because
# renewal-hook PATH is minimal.
/usr/bin/pm2 stop server
