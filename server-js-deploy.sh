#!/bin/bash

LOCAL_ROOT=$(dirname $0)
REMOTE_ROOT=/root/digital-strength/


rsync -avzhc $LOCAL_ROOT/server.js digitalstrength.dev:$REMOTE_ROOT
rsync -avzhc $LOCAL_ROOT/db digitalstrength.dev:$REMOTE_ROOT
rsync -avzhc $LOCAL_ROOT/ecosystem.config.js digitalstrength.dev:$REMOTE_ROOT
