# Digital Strength(Work in Progress 💻)

[![CI](https://github.com/laststance/digital-strength/actions/workflows/ci.yml/badge.svg)](https://github.com/laststance/digital-strength/actions/workflows/ci.yml)
[![Depfu](https://badges.depfu.com/badges/21dd00bdaefaebe1957173b9bb2eba6f/overview.svg)](https://depfu.com/github/laststance/digital-strength?project_id=17741)

A hand made small blog system for taking note what Today I Learned day by day.

![image](./image.jpeg)

# Getting start local development

1. `yarn install`
2. `docker-compose up -d`
3. `yarn db:connection:test`
4. `yarn db:sync`
5. `yarn db:seed`
6. `yarn start`
7. `yarn server:start`

# Commands

## `yarn start`

Start local front-end dev server by create-react-app.

## `yarn build`

Make production front-end bundle.

## `yarn deploy`

run deploy.sh

## `yarn workflow:deploy`

all in one command for deploy

## `yarn test`

Run create-react-app tests.

## `yarn typecheck`

TypeScript type check in front-end.

## `yarn lint`

Run ESLint on create-react-app.

## `yarn lint:fix`

Run ESlint with --fix option on create-react-app.

## `yarn server:build`

Build `backend/` dir Express server.

## `yarn server:start`

Start dev backend Express server.

## `yarn sync:db`

Sync sequelize model definition to actual MySQL.

## `yarn db:seed`

Import sample data for dev environment.

## `yarn db:drop`

DB drop

## `yarn db:hashgen`

generate password hash
