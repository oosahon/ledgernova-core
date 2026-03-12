# Contributing to Purple Ledger

This document provides guidelines for contributing to this project to ensure a smooth workflow and high-quality code.

## Design Pattern

- We implement Pragmatic Functional OOP.
  - All functions/methods -- other than infrastructure services -- are pure (causing no side effect).
  - All similar functions are grouped in an immutable object
  - Function/Methods do not call external services directly. Dependencies are wired up in `app/use-cases/*`
- For the folder structure, we have favored Domain Driven Design.

Here are the top level folders you would find on the application:

```text

src/
├─ app/                 # Application layer: orchestrates use-cases, handles commands, maps data between domain and external interfaces
│  ├─ contracts/        # Defines infrastructure services interfaces (contracts) used in the application. (Only use-cases/* uses actual implementations)
│  ├─ dto/              # Data Transfer Objects: definitions for data exchanged between layers (input/output)
│  ├─ events/           # Application events: domain or feature events that trigger async behavior (e.g., newsletter subscription)
│  ├─ handlers/         # Application event handlers.
│  ├─ mappers/          # Mapping between domain entities and application interfaces (DTOs, API contracts)
│  ├─ services/         # Application services are a set of functions that combine infrastructure services and domain entities to perform a specific task
│  └─ usecases/         # Usecases: concrete business operations, orchestrating domain entities, repos, and services.
│
├─ domains/             # Domain layer: core business logic, entities, repo interfaces and rules
│
├─ http/                # API REST endpoints, SSE, route middlewares, etc
|  ├─ controllers/      # HTTP controllers: handle HTTP requests and responses. Primarily used with tsoa for API documentation
|  ├─ middlewares/      # HTTP middlewares: handle HTTP requests and responses
|  └─ validations/      # HTTP request validations: validate HTTP requests
│
├─ infra/               # Technical layer: implementations of services, database, messaging, and infrastructure concerns
│  ├─ ai/               # AI services: OpenAI, Claude, etc
│  ├─ bootstrap/        # Setups up the data required for the application to run properly (e.g., system currencies, categories, and event bus)
│  ├─ cache/            # Cache implementations: Redis connections and caching logic
│  ├─ config/           # Configuration files for app, environment variables, secrets, and third-party services
│  ├─ db/               # Database-specific implementations
│  │  ├─ enums          # Database-related enums
│  │  ├─ repo           # Domain repo implementation: db queries
│  │  └─ schema         # Database schemas
│  ├─ email/            # Email services: email notification templates
│  ├─ messaging/        # Event bus, message queues, pub/sub infrastructure
│  ├─ observability/    # Logging, metrics, monitoring, and tracing
│  ├─ server/           # Express (or other HTTP) server setup and bootstrapping
│  └─ services/         # External service clients (S3, email, AI providers, payment gateways)
│
├─shared/              # Shared utilities and types used across multiple layers
│  ├─ data/             # Shared constants and data
│  ├─ entities/         # Shared value objects and entities that are not domain entities/value objects
│  ├─ types/            # Global TypeScript types and interfaces
│  └─ utils/            # Helper functions, constants, and reusable utilities
└─ tests/
  ├─ domain/            # Domain tests
  ├─ events/            # Events tests
  ├─ fixtures/          # Fixtures for tests
  ├─ infra/             # Infrastructure tests
  ├─ mocks/             # Mocks for tests
  └─ unit/              # Unit tests

```

## Git Workflow

To maintain a clean and organized codebase, please follow these strict git workflow guidelines.

### Branching Strategy

- **`development`**: This is the main branch for development. All contributor Pull Requests (PRs) should be merged into `development`.
- **`staging`**: This branch is for pre-release testing. Code from the `development` branch is merged here.
- **`main`**: This is the production branch. Only the `staging` branch and hotfix branches are merged here.

### Feature Branches

- **Source**: Every new branch must be created off the `development` branch.
- **Target**: Every update must be submitted as a PR to the `development` branch.
- **Naming Convention**:
  - Branches should be named using the format: `<type>/<ticket-id>/<short_description>`
  - **Types**: `feat`, `fix`, `chore`, `refactor`, `test`
  - **Examples**:
    - `feat/49494/accounts`
    - `fix/12345/login-error`

### Commit Messages

We enforce a specific commit message format to generate clean changelogs and track history effectively.

- **Format**:
  ```text
  <task_type>: [Title]
  [description] (<ticket_id>)
  ```
- **Rules**:
  - If using the title and description format, the **Title** must be capitalized.
- **Examples**:
  - `feat: Add endpoint to create account (3442)`
  - ```text
    test: Smoke test
    improves smoke test (32232)
    ```

## Reporting Bugs

If you find a bug, please create a ticket for it.

- **Requirement**: Every bug report must have a corresponding ticket.
- **Format**: The ticket must clearly specify:
  1.  **Expected Behaviour**: What should happen.
  2.  **Current Behaviour**: What is actually happening.
