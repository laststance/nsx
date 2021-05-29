#!/bin/bash

LOCAL_ROOT=$(dirname $0)
REMOTE_ROOT=/root/digital-strength

ssh root@digitalstrength.dev 'cd digital-strength | rm -rf server_build | rm -rf build'
scp -r $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT/build
scp -r $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT/server_build
