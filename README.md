# Introduction

This repo contains the server-side source code for Purple Ledger's bookkeeping and tax app.

## Requirements

- Docker
- Node.js (>=20.18.1 as specified in `package.json`)
- Yarn
  NB: we use yarn specifically because of its peer dependency resolution. Please DO NOT use npm.

## Installation

- Clone the repo
- Run `yarn install`
- Copy the environment variables from Doppler (dev) and save them in a `.env` file in the root directory. [Env URL](https://dashboard.doppler.com/workplace/b0fb8d6179aa66108eac/projects/purple-ledger-be/configs/dev)

## Running the app

- Ensure docker is running
- Run `yarn migrate`
- Run `yarn dev`
- The app should now be running on `http://localhost:${PORT}`

For database setup:

```bash
yarn start:postgres
yarn start:redis
yarn db:migrate
```

### Testing

Run the test suite:

```bash
yarn test
```

### Linting and Formatting

Format your code before submitting a PR:

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
