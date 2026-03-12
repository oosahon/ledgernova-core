# Purple Ledger Core Rules

These rules dictate the foundational boundaries of the application. Always prioritize these over making assumptions.

## Architecture & Layering (Domain Driven Design)

- **Pragmatic Functional OOP**: All functions/methods (other than infrastructure services) MUST be pure (causing no side effects). Group similar functions in immutable objects.
- **Dependency Wire-up**: Functions/methods do NOT call external services directly. Dependencies are wired up exclusively in the `app/usecases/*` layer.
- **Repository Boundaries**: Database repositories (`src/infra/db/repo/*`) MUST ONLY handle Drizzle ORM queries and return raw data payloads. **NEVER** place domain logic, data mapping, or calculations inside repository implementations.
- **Domain Mapping**: The Use Case layer orchestrates the mapping between raw database payloads and domain representations (using `src/app/mappers/*`).

## System & Reference Data

- **Never Hardcode System Tokens**: Never hardcode base currencies, global categories, or application constants inside logic files. Always fetch reference data directly from the system via the database (e.g., using `currencyRepo.findByCode` or `categoryRepo`).

## Testing Conventions

- **Strict Directory Enforcement**: ALL unit tests MUST strictly reside inside the `/tests` directory.
- **Mirroring `src`**: The test filepath must accurately map to its structural equivalent inside `src`.
  - _Example_: A test verifying `src/app/usecases/reporting/get-sofp.usecase.ts` MUST be generated at `tests/app/usecases/reporting/get-sofp.usecase.test.ts`.

## API Framework (TSOA)

- **Required Generation**: We utilize `tsoa` for controllers and Swagger routing. When making any modifications, creations, or deletions to a file in `src/http/controllers/*`, you MUST regenerate the routes via `yarn build:routes`.
