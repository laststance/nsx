#!/bin/bash

LOCAL_ROOT=$(dirname $0)
REMOTE_ROOT=/root/digital-strength

ssh root@digitalstrength.dev 'cd digital-strength; rm -rfv server_build; rm -rfv build;'
scp -rv $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT/build
scp -rv $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT/server_build
