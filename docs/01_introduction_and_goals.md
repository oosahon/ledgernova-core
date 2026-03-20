# 1. Introduction and Goals

We want to build a bookkeeping and tax computation tool for Nigerian individuals, sole traders, and organisations with strong accounting foundations. Despite the strict adherence to accounting standards, we want accountants and non-accountants to find it seamless.

For non-accountants, the system will handle the heavy-lifting of creating ledger accounts and reasonable provisions for transaction categorisations.\
Users with accounting knowledge can create self-managed journals and define posting methods.

## 1.1 Requirements Overview

- **Bookkeeping**: users should be able to record transactions and derive meaningful reports from these transactions
- **Tax advisory**: the system will provide tax advisory in accordance to the Nigeria Tax Act (NTA) 2025 for individuals, sole traders and organisations

## 1.2 Quality Goals

1. **Data integrity**: the system must prevent un-auditable mutations to records. i.e., transactions, journal entries, etc. must have a solid audit trail regardless of the user's accounting knowledge or their use case.
2. **Maintainability**: the system must be built in a way that it remains maintainable for a long period. Proper boundary contexts must be respected across contexts. For example, a change to a tax law must not cause a change in other modules other than that specific tax module.
3. **Operability**: the system must remain easy to operate regardless of the accounting knowledge of the user. For example, users with no accounting knowledge should not be made to set up their general ledger or subledger accounts. Although this will be handled under the hood, the system must find creative ways to abstract accounting jargon if need be.

## 1.3 Stakeholders

| Role/Name         | Contact                             | Expectations                                                        |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------- |
| Developers        | [Osahon Oboite](https://osahon.dev) | Clear bounded contexts, easy onboarding, fast reliable tests        |
| Product Owner     | [Osahon Oboite](https://osahon.dev) | Fast feature delivery, correct accounting and tax rule calculations |
| Auditors (Future) |                                     | Clean trails of financial data, reliable reporting                  |
