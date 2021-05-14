# Digital Strength(Work in Progress 💻)

[![CI](https://github.com/laststance/digital-strength/actions/workflows/ci.yml/badge.svg)](https://github.com/laststance/digital-strength/actions/workflows/ci.yml)
[![Depfu](https://badges.depfu.com/badges/21dd00bdaefaebe1957173b9bb2eba6f/overview.svg)](https://depfu.com/github/laststance/digital-strength?project_id=17741)

A hand made small blog system for taking note what Today I Learned day by day.

# Getting start local development

1. `yarn install`
2. `docker-compose up -d`
3. `yarn db:connect:test`
4. `yarn db:sync`
5. `yarn db:seed`
6. `yarn start`
7. `yarn server-start`

# Commands

## `yarn start`

Start local front-end dev server by create-react-app.

## `yarn build`

Make production front-end bundle.

## `yarn test`

Run create-react-app tests.

## `yarn eject`

As same as create-react-app eject.

## `yarn typecheck`

TypeScript type check in front-end.

## `yarn lint`

Run ESLint on create-react-app.

## `yarn lint:fix`

Run ESlint with --fix option on create-react-app.

## `yarn server-build`

Build `backend/` dir Express server.

## `yarn server-start`

Start dev backend Express server.

## `yarn sync:db`

Sync sequelize model definition to actual MySQL.

## `yarn import:db:seed`

Import sample data for dev environment.

# API Spec

[api-spec.yml](https://github.com/laststance/digital-strength/blob/master/api-spec.yml) is spefication of REST API on Express backend.
We organize and sync to github from [Postman Workspace](https://web.postman.co/workspace/9e5a010e-45ac-48e0-80e7-45eb42452fbb/api/e9b46884-e509-4fc2-aa75-0c83ad0d3cd2).

## Postman Mock Server

Postman has Mock Server feature based on `api-spec.yml`.
But now we can't use it cause whos facing connetion amount limitation.
So we are using local Express server for access API during development, there is a environment value [REACT_APP_API_ENDPOINT](https://github.com/laststance/digital-strength/blob/master/.env#L2) to set API ENDPOINT.

