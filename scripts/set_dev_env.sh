#!/bin/bash
ROOT_DIR=$(cd $(dirname $0)/..; pwd)

sed -i -e "s/VITE_API_ENDPOINT=https:\/\/digitalstrength.dev\/api\//VITE_API_ENDPOINT=http:\/\/localhost:3000\/api\//" $ROOT_DIR/.env
#sed -i -e "s/VITE_ENABLE_LOGIN=false/VITE_ENABLE_LOGIN=true/" $ROOT_DIR/.env
#sed -i -e "s/VITE_ENABLE_SIGNUP=false/VITE_ENABLE_SIGNUP=true/" $ROOT_DIR/.env
