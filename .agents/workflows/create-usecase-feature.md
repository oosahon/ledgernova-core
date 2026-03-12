---
description: How to safely implement a new application use case and controller end-to-end
---

# Workflow: Create an Application Use Case

Follow these steps sequentially to implement a new feature while guaranteeing adherence to our DDD architecture standards.

1. **Define the Contract**
   - Navigate to `src/app/contracts/`
   - Define the interface for your planned database or infra operations.
   - **Constraint**: The interface must return raw data objects/primitives, NOT domain entities.

2. **Implement the Infrastructure Repository**
   - Navigate to `src/infra/db/repo/`
   - Implement the contract via Drizzle ORM (`db.select(...)`).
   - Handle JOINs and groupings, but DO NOT perform application domain logic here.

3. **Develop the Application Use Case**
   - Navigate to `src/app/usecases/<module>/`
   - Inject the repository interface. If you need global reference data (like user preferences or system currencies), inject their respective repos too (e.g. `ICurrencyRepo`).
   - Retrieve raw data from the repository, compute your domain logic, and map the outputs.
   - Export your new usecase from the module's `index.ts`.

4. **Develop the HTTP Controller**
   - Navigate to `src/http/controllers/`
   - Scaffold the `@Route` utilizing `tsoa` decorators.
   - Add proper authentication middlewares (`@Middlewares(isAuthenticatedUserMiddleware)`).

// turbo 5. **Compile Routes**

- Run `yarn build:routes` so `tsoa` registers the new HTTP endpoint.

6. **Create Unit Tests**
   - Navigate to the `tests/` directory matching your exact folder depth mapping (e.g., `tests/app/usecases/<module>/`).
   - Mock all dependencies using the pre-existing mocks in `tests/mocks/repos/*`.
   - Verify the business logic rules inside the use case.
