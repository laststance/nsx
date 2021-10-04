#!/bin/bash
ROOT_DIR=$(cd $(dirname $0)/..; pwd)

sed -i -e "s/#REACT_APP_API_ENDPOINT=http:\/\/localhost:3000\/api\//REACT_APP_API_ENDPOINT=http:\/\/localhost:3000\/api\//" $ROOT_DIR/.env
sed -i -e "s/REACT_APP_API_ENDPOINT=https:\/\/digitalstrength.dev\/api\//#REACT_APP_API_ENDPOINT=https:\/\/digitalstrength.dev\/api\//" $ROOT_DIR/.env
#sed -i -e "s/REACT_APP_ENABLE_LOGIN=false/REACT_APP_ENABLE_LOGIN=true/" $ROOT_DIR/.env
#sed -i -e "s/REACT_APP_ENABLE_SIGNUP=false/REACT_APP_ENABLE_SIGNUP=true/" $ROOT_DIR/.env
