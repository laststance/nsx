[![Build](https://github.com/laststance/nsx/actions/workflows/build.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/build.yml)
[![Typecheck](https://github.com/laststance/nsx/actions/workflows/typecheck.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/typecheck.yml)
[![Test](https://github.com/laststance/nsx/actions/workflows/test.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/test.yml)
[![Lint](https://github.com/laststance/nsx/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/lint.yml)
[![Depfu](https://badges.depfu.com/badges/21dd00bdaefaebe1957173b9bb2eba6f/overview.svg)](https://depfu.com/github/laststance/nsx?project_id=17741)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://main--61c089c06b3b4d003adde63b.chromatic.com)
[![Cypress E2E Admin Side](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-admin-side.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-admin-side.yml)
[![Cypress-E2E Visitor Side](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-visitor-side.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-visitor-side.yml)
[![Cypress-E2E New Install User](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-new-install-user.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/cypress-e2e-new-install-user.yml)

> # Project Status: currently under development and scheduled for release in release 2024.
>
> The ultimate goal for this project is release it as a personal blog starter kit for React developers like Minimal Wordpress.  
> I'm developping essential feature while my spare time, currenty I planning release v1 2024.  
> All core feature implemented completely, I'm planning distribute repo source directly as similar as [Beam](https://github.com/planetscale/beam).
> [Roadmap](https://github.com/laststance/nsx/projects/1)

##### Jest Coverage

<p align="left">
<img src="./jest/badge-branches.svg" />
<img src="./jest/badge-functions.svg" />
<img src="./jest/badge-lines.svg" />
<img src="./jest/badge-statements.svg" />
</p>

# NSX

<a src="https://digitalstrength.dev">
  <img src="https://digital3.nyc3.cdn.digitaloceanspaces.com/nsx.gif" />
</a>

⚛️ [Production](https://digitalstrength.dev)
✅ [Storybook](https://main--61c089c06b3b4d003adde63b.chromatic.com)

Currently doghooding this project as a Today I Read mini blog.

But I if you have interest for the implementation code, local development environment is availavle for everyone.

# Prerequisites

#### Install [Volta](https://volta.sh/)

```shell
curl https://get.volta.sh | bash
```

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

# Getting start local development

1. `git clone https://github.com/laststance/nsx.git`
1. `cd nsx`
1. `node`
1. `yarn install`
1. `cp .env.sample .env`
1. `docker-compose up -d`
1. `yarn db:reset`
1. `yarn validate`
1. `yarn server:start`
1. in other terminal screen `yarn start`
1. `yarn e2e:admin`
1. then, you confirmed local develop environment working fine.

open sidebar press `x` key
DB seeds initial user account is  
name: `John Doe`  
pass: `popcoon`

## `yarn cy:open`

open [Cypress](https://www.cypress.io/)

## Enviroment Variables

These are storing `.env` and evaluate at build time.

### JWT_SECRET

set unique and hidden string for jwt.
