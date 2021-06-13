#!/bin/bash

LOCAL_ROOT=$(dirname $0)
REMOTE_ROOT=/root/digital-strength

usage() { echo "Usage: $0 [-s] [-c]" 1>&2; exit 1; }

while getopts ":sc" opt; do
    case "${opt}" in
        s)
            ssh root@digitalstrength.dev 'cd digital-strength; rm -rfv server_build;'
            scp -rv $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT/server_build
            exit 0
            ;;
        c)
            ssh root@digitalstrength.dev 'cd digital-strength; rm -rfv build;'
            scp -rv $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT/build
            exit 0
            ;;
    esac
done

ssh root@digitalstrength.dev 'cd digital-strength; rm -rfv server_build; rm -rfv build;'
scp -rv $LOCAL_ROOT/build digitalstrength.dev:$REMOTE_ROOT/build
scp -rv $LOCAL_ROOT/server_build digitalstrength.dev:$REMOTE_ROOT/server_build
