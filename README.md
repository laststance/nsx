[![Build](https://github.com/laststance/nsx/actions/workflows/build.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/build.yml)
[![Typecheck](https://github.com/laststance/nsx/actions/workflows/typecheck.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/typecheck.yml)
[![Test](https://github.com/laststance/nsx/actions/workflows/test.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/test.yml)
[![Lint](https://github.com/laststance/nsx/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/lint.yml)
[![Cypress E2E Admin Side](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-admin-side.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-admin-side.yml)
[![Cypress-E2E Visitor Side](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-visitor-side.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-visitor-side.yml)
[![Depfu](https://badges.depfu.com/badges/21dd00bdaefaebe1957173b9bb2eba6f/overview.svg)](https://depfu.com/github/laststance/nsx?project_id=17741)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://main--61c089c06b3b4d003adde63b.chromatic.com)

> # Project Status: currently under development and scheduled for release in 2023.
> The ultimate goal for this project is release it as a personal blog starter kit for React developers like Minimal Wordpress.  
> I'm developping essential feature while my spare time, currenty I planning publish v1 2023.  
> [Roadmap](https://github.com/laststance/nsx/projects/1)

# NSX

Prod ➡️ https://digitalstrength.dev  
Currently doghooding this project as a Today I Learned mini blog.

But I if you have interest for the implementation code, local development environment is availavle for everyone.  

# Prerequisites
- node higher than v16
- docker-compose (native linux or via docker-for-windows, docker-for-mac.

# Getting start local development

1. `yarn install`
2. `docker-compose up -d`
3. `yarn db:reset`
4. `yarn start`
5. `yarn server:start`

# NPM Scripts

## `yarn test`

Run jest.

## `yarn typecheck`
## `yarn server:typecheck`
## `yarn typeckeck:all`

TypeScript type check.

## `yarn lint`

Run ESLint front & server

## `yarn lint:fix`

Run ESlint front & server with --fix option

## `yarn db:hashgen`

cli password hash generator

## `yarn storybook`
## `yarn storybook-build`

## `yarn open:cy`
open [Cypress](https://www.cypress.io/)

## `yarn e2e:admin`
run [Cypress](https://www.cypress.io/)  
Must be set this within `.env`

```
VITE_ENABLE_SIGNUP=true
VITE_ENABLE_LOGIN=true
```

## `yarn e2e:visitor`
run [Cypress](https://www.cypress.io/)  
Must be set this within `.env`

```
VITE_ENABLE_SIGNUP=false
VITE_ENABLE_LOGIN=false
```

## Enviroment Variables

These are storing `.env` and evaluate at build time.

### VITE_API_ENDPOINT

- dev: `http://localhost:4000/api`
- prod: `https://digitalstrength.dev/api`

### VITE_ENABLE_SIGNUP=false|true

### VITE_ENABLE_LOGIN=false|true

Default false.  
Show each page link button at the `/` page.  
These only need initial setup of production admin user.

### JWT_SECRET

set unique and hidden string for jwt.
