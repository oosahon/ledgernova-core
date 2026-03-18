![Coverage Badge](https://file%2B.vscode-resource.vscode-cdn.net/Users/osahon/work/purple/ledgernova/ledgernova-core/badges/coverage.svg)

# LedgerNova

LedgerNova is an AI-powered, robust, auditable accounting software for companies, sole traders (business name owners), and individuals in Nigeria.\
It's a software for accountants and non-accountants alike.

Accounting-savvy users who want to be in control of everything can create journals, charts of accounts, etc.

Users with no accounting background are not left out. They can also track their income, expenses and taxes. Under the hood, LedgerNova will use accounting standards to set up their ledgers.\
\
LedgerNova was created with 💜 and distributed for free by [Osahon Oboite](https://osahon.dev)

## Introduction

This repo contains the core accounting module of LedgerNova.

## Requirements

- Docker
- Node.js (>=20.18.1 as specified in `package.json`)
- npm

## Installation

- Clone the repo
- Run `npm install`
- Copy the environment variables from Doppler (dev) and save them in a `.env` file in the root directory. [Env URL](https://dashboard.doppler.com/workplace/b0fb8d6179aa66108eac/projects/purple-ledger-be/configs/dev)

## Running the core app

- Ensure Docker is running in the background.
- Setup databases (e.g., `npm run start:postgres` and `npm run start:redis`).
- Run `npm run dev`
- The app should now be running on `http://localhost:${PORT}`

### Testing

Run the test suite:

```bash
npm test
```

### Linting and Formatting

Format your code before submitting a PR:

```bash
npm run format:all
```

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
