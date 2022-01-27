#!/bin/bash

LOCAL_ROOT=$(cd $(dirname $0)/..; pwd)
REMOTE_ROOT=/root/nsx/

usage() { echo "Usage: $0 [-s] [-f]" 1>&2; exit 1; }

while getopts ":sf" opt; do
    case "${opt}" in
        s)
            rsync -avzhc $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT
            rsync -avzhc $LOCAL_ROOT/ecosystem.config.js digitalstrength.dev:$REMOTE_ROOT
            exit 0
            ;;
        f)
            rsync -avzhc $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT
            exit 0
            ;;
    esac
done

rsync -avzhc $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT
rsync -avzhc $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT
rsync -avzhc $LOCAL_ROOT/ecosystem.config.js digitalstrength.dev:$REMOTE_ROOT
