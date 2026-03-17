---
description: How to write tests
---

# Workflow: Writing Mappers Tests

## How to write tests for mappers in `app/mappers/__tests__`

1. Create the `.test` file. NOT SPEC

2. Always use the respective entity/value objects `make` methods to create new domain values. If you have to hardcode, ensure it satisfies the type definition. NEVER USE ANY FOR DOMAIN VALUES/ENTITIES
