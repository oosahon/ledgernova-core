# Accounting

## Philosophy

Our philosophy is to follow a reporting-first approach to accounting. This means that we will first determine the reporting requirements for each accounting domain and then create a set of ledger accounts that will allow us to generate the required reports. We will also create a set of behaviors that will be built into these ledger accounts. For non-power users, these accounts and behaviors will be bootstrapped while power users will have the ability to create accounts and associate behaviors available to the account class.

## Reporting Needs

LedgerNova will support the following reporting for all three accounting domains:

#### Individuals

- Personal Income Statement
- Expense & Spending Analysis
- Personal Cash Flow Statement (SoCF)
- Budget vs. Actual (BvA) Report
- Statement of Net Worth
- Consolidated Account Balances
- Debt & Liability Aging Report
- Savings & Financial Goals Tracker
- Investment Portfolio Performance
- Personal Income Tax (PIT) Summary
- Recurring Transactions & Subscription Audit
- Financial Trends & Custom Analytics

#### Sole Traders

- Statement of Profit or Loss (SoPL)
- Statement of Financial Position (SoFP)
- Statement of Cash Flows (SoCF)
- Aged Receivables Ledger
- Aged Payables Ledger
- Sales & Revenue Performance Report
- Expense & Overheads Analysis
- Statutory Returns (VAT/WHT)
- Bank Reconciliation Statement
- Inventory Valuation Report (IVR)
- Payroll & Personal Income Tax (PIT) Remittance
- Budget vs. Actual (BvA) Report
- Statement of Owner’s Equity
- Fixed Asset Register (FAR)
- Break-even Analysis Report
- Working Capital & Liquidity Report

#### Organizations

- Statement of Profit or Loss (SoPL)
- Statement of Financial Position (SoFP)
- Statement of Cash Flows (SoCF)
- Statement of Changes in Equity (SoCE)
- Aged Receivables Ledger
- Aged Payables Ledger
- Trial Balance (TB)
- Fixed Asset Register (FAR)
- Inventory Valuation Report (IVR)
- Bank Reconciliation Statement
- Budget vs. Actual (BvA) Report
- Cash Flow Forecast
- Segment/Divisional Performance Report
- Statutory Tax Returns (VAT/WHT/CIT)
- General Ledger (GL) Audit Trail
- Cost of Goods Manufactured (COGM)
- Working Capital & Liquidity Report
- Payroll & Statutory Remittance Report
- Intercompany Elimination Report
- Break-even Analysis Report

> [!INFO]
> For the MVP, we will only support the individual accounting domain.
> Therefore, the following documentation will be scoped to the individual (power and non-power users).

### Reporting Requirements

For us to adequately generate the above reports, we need to ensure that our accounts are properly categorized. We also need to ship with meaningful transaction categories and ledger classes that will help the system with predefined behaviors.

To achieve this, we have modeled our Charts of Accounts thus:

## Charts of Accounts

Our Chart of Accounts will follow a 5-digit (or up to 6-digit) hierarchical coding structure: **A-BB-CC...**. Where:

- **A** (1 digit) represents the primary account class (1=Asset, 2=Liability, 3=Equity, 4=Revenue, 5=Expense)
- **BB** (2 digits) represents the account group and sub-header (e.g. Cash and Cash Equivalents, Retained Earnings, etc.)
- **CC** (2 digits) represents the control account or sub-ledger

Codes will be allocated through **Sequential Slotting** to ensure natural grouping and extensibility.\
Power users can set the display code for accounts, but the internal code will always follow the above structure.

### Metadata-Driven Account Behavior

Instead of hardcoding account behavior into the ledger strings (e.g. using a specific suffix digit for contra or adjunct accounts), LedgerNova uses a **metadata-driven** architecture.

A ledger account's behavior and system constraints are defined dynamically by its properties in the database:

- `behavior_type`: Enum (`BASIS`, `CONTRA`, `ADJUNCT`, `SUSPENSE`, `ELIMINATION`)
- `target_basis_account_id`: A self-referential foreign key linking an adjustment account directly to its basis account.

This enables a single basis account to have multiple contra accounts (e.g., Accumulated Depreciation AND Impairment Loss) without exhausting specific ledger code slots out-of-order, and allows the reporting engine to adapt seamlessly.

For users who migrate from other systems to ours, we will preserve their ledger codes in the db level (`external_ledger_code`), but internally we will follow our strict nomenclature. Also, we will allow users to choose what code to display on the UI.

> [!INFO]
> A more contrived version will be displayed for non-accountant users in the individual accounting domain.
> Nonetheless, under the hood, this will be the complete structure

> [!WARNING]
> Adjustment accounts (Contra/Adjunct) act as separate control accounts in the hierarchy but are logically linked to their basis counterparts. Sub-ledgers post directly to their logical control accounts naturally.

> [!INFO]
> We reserve specific blocks for system-controlled categories like Cash, but 'Other' categories are a free-for-all within the ledger block, driven purely by user-defined header accounts."

### Assets

<figure>
<img src="./assets/coa-assets.svg" alt="Assets Chart of Accounts"  style="max-width: 100%; width: auto; max-height: 600px;">
<figcaption>

_Figure 1: View the mermaid sourcecode here:&#x20;_[_coa-assets.mermaid_](./assets/coa-assets.mermaid)

</figcaption>
</figure>

## Liabilities

<figure>
<img src="./assets/coa-liabilities.svg" alt="Liabilities Chart of Accounts"  style="max-width: 100%; width: auto; max-height: 600px;">
<figcaption>

_Figure 2: View the mermaid sourcecode here:&#x20;_[_coa-liabilities.mermaid_](./assets/coa-liabilities.mermaid)

</figcaption>
</figure>
_Figure 2: View the mermaid sourcecode here:&#x20;_[_coa-liabilities.mermaid_](./assets/coa-liabilities.mermaid)

### Equities

<figure>
<img src="./assets/coa-equities.svg" alt="Equities Chart of Accounts"  style="max-width: 100%; width: auto; max-height: 600px;">
<figcaption>

_Figure 3: View the mermaid sourcecode here:&#x20;_[_coa-equities.mermaid_](./assets/coa-equities.mermaid)

</figcaption>
</figure>

### Revenues

<figure>
<img src="./assets/coa-revenues.svg" alt="Revenues Chart of Accounts"  style="max-width: 100%; width: auto; max-height: 600px;">
<figcaption>

_Figure 4: View the mermaid sourcecode here:&#x20;_[_coa-revenues.mermaid_](./assets/coa-revenues.mermaid)

</figcaption>
</figure>

### Expenses

<figure>
<img src="./assets/coa-expenses.svg" alt="Expenses Chart of Accounts"  style="max-width: 100%; width: auto; max-height: 600px;">
<figcaption>

_Figure 5: View the mermaid sourcecode here:&#x20;_[_coa-expenses.mermaid_](./assets/coa-expenses.mermaid)

</figcaption>
</figure>
