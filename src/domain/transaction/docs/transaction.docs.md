# Transactions

This document outlines the ubiquitous language and business-level definitions for transactions within our organization. Using these shared terms ensures clear communication across technical and business domains.

## What is a Transaction?

A transaction is a record of a financial or business event that changes the state of accounts. It acts as the definitive source of truth for movements of value—whether it is an exchange of money, the sale of goods, or an internal adjustment. Every transaction groups together specific details (who, when, and how much) and the individual items or services involved in the event.

## Types of Transactions (`ETransactionType`)

Transactions are categorized by their business purpose. Understanding the type clarifies the nature of the event:

- **Sale**: Revenue generated from selling goods or services to a customer.
- **SaleReturn**: A reversal of a sale, typically because a customer returned the goods or services.
- **Purchase**: The acquisition of goods or services from a vendor or supplier.
- **PurchaseReturn**: A reversal of a purchase, typically because goods were returned to the vendor.
- **Transfer**: The movement of funds internally from one account to another (e.g., transferring cash from a checking account to a savings account).
- **Expense**: A cost incurred in or required for the operation of the business.
- **Payment**: The outflow of funds to settle an obligation, such as paying a vendor or an operational expense.
- **Receipt**: The inflow of funds, commonly received from a customer settling an invoice.
- **Refund**: Returning funds to a customer, or receiving funds back from a vendor.
- **Journal**: A manual accounting entry used to adjust account balances or record non-standard movements.

## Transaction Direction (`ETransactionDirection`)

The direction indicates the accounting flow of value for a given account.

- **Debit**: An entry that typically increases an asset or expense account, or decreases a liability, equity, or revenue account.
- **Credit**: An entry that typically increases a liability, equity, or revenue account, or decreases an asset or expense account.

## Transaction Status (`ETransactionStatus`)

The status defines the current state of a transaction within its lifecycle. Utilizing the correct status is critical for accurate financial reporting and operational workflows.

- **Pending**: The transaction has been initiated but is awaiting approval, processing, or clearance. It may not yet be reflected in finalized account balances. Use this when a transaction is expected but not fully settled.
- **Posted**: The transaction is finalized, immutable, and officially recorded in the ledger. It actively and permanently impacts account balances. Use this when the business event is complete.
- **Voided**: The transaction was cancelled or invalidated. Though the record is retained for audit trails and historical accuracy, a voided transaction does not impact account balances. Use this to reverse a transaction that was created in error.
- **Archived**: The transaction is historical, often from a closed accounting period. It is retained strictly for record-keeping and audit purposes, and is typically filtered out of active, day-to-day operational views.

## Transaction Item (`ITransactionItem`)

A Transaction Item represents an individual line item or detail within a larger total transaction.

**Why they are crucial:**
While the transaction provides the _total_ monetary value, the transaction items specify _what exactly_ makes up that value. They break down the transaction by specific products, services, or categories, including quantities (`quantity`) and unit prices (`unitPrice`). This granularity is essential for inventory management, detailed financial reporting, granular tax calculation, and understanding unit economics.

## Transaction Header (`ITransaction`)

The Transaction Header (or simply, the "Transaction") is the top-level record that encapsulates a single business event. It acts as the parent container that groups one or more Transaction Items together.

It stores the overarching metadata of the event, including:

- The total aggregated **amount**.
- The main **accounts** involved (e.g., `accountId`, `recipientAccountId`).
- The **date** the event occurred.
- The user who **created** the record.
- Any supporting details like **notes** or references to **attachments** (e.g., receipts, invoices).

In essence, the transaction header provides the "who, when, and where," while the items provide the detailed "what."
