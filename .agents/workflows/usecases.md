---
description: How to safely implement a new application use case and controller end-to-end
---

# Workflow: Create an Application Use Case

Use the following as a guide for creating new use cases

1. Always use dependencies for all non-domain logic. You can find the contracts for these dependencies in `app/contracts/**/*.ts`. Db access, use the repo definitions in `domain/*/repos/*.ts`

- If the contract does not exist, create the contract using the guide in `.agents/workflows/contracts.md`

2. After implementing a usecase, define/update the spec in the `__specs__` directory in the same folder

3. Wire up the use case function in the `index.ts` file in the same directory.

4. Use the following naming convention:

- file: `<action>-<entity>.usecase.ts`
- function: `<action><Entity>UseCase>` (camelCase)
