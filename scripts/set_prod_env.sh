#!/bin/bash
ROOT_DIR=$(cd $(dirname $0)/..; pwd)
echo $ROOT_DIR

sed -i -e "s/VITE_API_ENDPOINT=http:\/\/localhost:3000\/api\//VITE_API_ENDPOINT=https:\/\/digitalstrength.dev\/api\//g" $ROOT_DIR/.env
#sed -i -e "s/VITE_ENABLE_SIGNUP=true/VITE_ENABLE_SIGNUP=false/" $ROOT_DIR/.env
