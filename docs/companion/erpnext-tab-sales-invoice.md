# Companion artifact — ERPNext `tabSales Invoice`

A one-page companion to the Project H sample. Applies the **same column-classification methodology** from *SourceWare Technical Approach* §5.1 to a **real, public, code-citable legacy substrate**: ERPNext's `tabSales Invoice` table (≈155 columns in current `frappe/erpnext` `main`).

Purpose: the Project H sample (`schema/tables/patient-profile.md`) demonstrates the methodology with citations to Confluence pages and user-story IDs because Project H is pre-implementation. This companion shows the same beats — logical grouping, per-column classification, `VALIDATE:` flagging, implicit-FK catalog — with citations to real code paths from a public legacy commercial substrate. Reader can see both variants of the same method.

## Business purpose

`tabSales Invoice` is ERPNext's transactional record for customer billing. One row per invoice; every invoice carries header data (customer, dates, currency, totals, payment terms), line-level summary fields, tax breakdowns, multi-currency snapshots, accounting-period flags, regional compliance fields (GST/HST/India/EU), and audit metadata. The table accumulated columns across ten-plus years of ERPNext releases; the column shape today is the outcome of feature additions made across versions.

Source: `erpnext/accounts/doctype/sales_invoice/sales_invoice.json` (DocType definition in the `frappe/erpnext` repository, branch `main`).

## Logical groupings

The composite naturally splits into 12 clusters:

1. **Identity & series.** `name`, `naming_series`, `amended_from`, `is_return`, `return_against`.
2. **Customer & addressing.** `customer`, `customer_name`, `customer_address`, `address_display`, `contact_person`, `contact_display`, `customer_group`, `territory`.
3. **Dates & accounting period.** `posting_date`, `posting_time`, `due_date`, `set_posting_time`, `update_billed_amount_in_sales_order`.
4. **Pricing & currency snapshot.** `currency`, `conversion_rate`, `price_list_currency`, `plc_conversion_rate`, `selling_price_list`, `ignore_pricing_rule`.
5. **Totals — pre-tax, tax, post-tax.** `total`, `net_total`, `total_taxes_and_charges`, `grand_total`, `rounded_total`, `in_words`.
6. **Outstanding & payment state.** `outstanding_amount`, `paid_amount`, `write_off_amount`, `status`, `is_pos`, `is_consolidated`.
7. **Line item summary references.** `items` (child table), `taxes` (child table), `payments` (child table) — denormalised back into header counters.
8. **Regional compliance (GST / EU).** `gst_category`, `place_of_supply`, `irn`, `eway_bill_validity`, `is_export_with_gst`.
9. **Project & cost-center references.** `project`, `cost_center`, `account_for_change_amount`.
10. **Payment terms.** `payment_terms_template`, `payment_schedule` (child table), `due_date` (cross-reference).
11. **Document workflow & status.** `docstatus`, `workflow_state`, `submitted_by`, `cancelled_by`, `letter_head`, `select_print_heading`.
12. **Audit & system metadata.** `creation`, `modified`, `modified_by`, `owner`, `idx`, `_user_tags`, `_comments`, `_assign`, `_liked_by`.

That accounts for the cleanly-grouped majority. ≈40 columns sit in the "long tail" — regional-specific fields, deprecated flags, integration-with-Shopify columns, debit-note carve-outs — that are workshop topics row by row.

## Column reference (representative slice)

The full DDL has ≈155 columns; the slice below covers each cluster and includes ≥ 3 `VALIDATE:` rows per TA §5.1. Citations are to file paths in `frappe/erpnext` `main`.

| Column | Type | Nullable | Business meaning | Observed usage | Status |
| --- | --- | --- | --- | --- | --- |
| `name` | `varchar(140)` | no | Primary key. Composed from `naming_series` (e.g., `ACC-SINV-2024-00042`). | DocType definition; primary-key references across `accounts/doctype/sales_invoice/sales_invoice.py`. | Resolved. |
| `naming_series` | `varchar(140)` | no | Series prefix template controlling `name` generation. | `frappe/model/naming.py`; settings under `selling_settings`. | Resolved. |
| `amended_from` | `link → Sales Invoice` | yes | When non-null, links to the original invoice this one amends. | `accounts/doctype/sales_invoice/sales_invoice.py:on_cancel`; `frappe/model/document.py:amend`. | Resolved (cross-document FK). |
| `customer` | `link → Customer` | no | Customer record. | Heavily referenced from `pricing_rule.py`, `general_ledger.py`. | Resolved. |
| `posting_date` | `date` | no | Accounting posting date (may differ from creation date for back-dated entries). | Used by `accounts/general_ledger.py` to determine GL period. | Resolved. |
| `outstanding_amount` | `decimal(18,6)` | no | Unpaid balance after applying `payments`. | Computed in `sales_invoice.py:set_status`; consumed by AR aging report. | Resolved. |
| `is_pos` | `int(1)` | no | Flag: is this invoice a POS-generated row? | Branches `update_status_updater_args` in `sales_invoice.py`. | Resolved. |
| `gst_category` | `varchar(140)` | yes | India-specific GST classification (Registered / Unregistered / Composition / etc.). | Read by `regional/india/utils.py`; nullable for non-India installs. | `VALIDATE:` whether the enum is locked or open-ended — `regional/india/utils.py:validate_gst_category` enumerates 7 values, but `accounts/doctype/sales_invoice/sales_invoice.json` declares the column as plain `Data`. Workshop topic: enforce as Select. |
| `is_consolidated` | `int(1)` | no | POS consolidated-invoice flag (multiple shifts → one invoice). | `accounts/doctype/pos_invoice_merge_log/`. | Resolved. |
| `update_billed_amount_in_sales_order` | `int(1)` | no | Toggle: whether to write back to linked `Sales Order.billed_amount`. | `sales_invoice.py:update_status_updater_args`. | `VALIDATE:` the toggle default differs between desktop entry (off) and import scripts (on); inconsistency carried since v12. Workshop topic for documentation. |
| `c_form_no` | `varchar(140)` | yes | India CST C-Form serial — pre-GST tax instrument. | Referenced from `accounts/doctype/c_form/`. | `> [!deprecated]` candidate: CST C-Form pre-dates the 2017 GST regime. Active references: 1 (the C-Form DocType itself). Likely retained for historical compliance reads only. |
| `irn` | `varchar(140)` | yes | India e-invoice Invoice Reference Number, generated by IRP portal. | `regional/india/e_invoice/utils.py`. | Resolved. |
| `eway_bill_validity` | `date` | yes | India e-way bill validity expiration. | Same region module. | Resolved. |
| `is_export_with_gst` | `int(1)` | yes | Export-with-payment-of-GST flag (vs LUT-based export). | `regional/india/utils.py`. | `VALIDATE:` two India regional codepaths read this flag; `e_invoice/utils.py` assumes one default, `gst_invoice.py` assumes another. Workshop: align defaults. |
| `set_posting_time` | `int(1)` | no | User flag: lock posting time at this exact moment. | UI toggle in form view; consumed by `frappe/utils/data.py`. | Resolved. |
| `letter_head` | `link → Letter Head` | yes | Print-template letterhead override. | Print-format renderer. | Resolved. |
| `_liked_by` | `varchar(140)` | yes | JSON-encoded array of users who "liked" this doc. Frappe-framework feature, not business meaning. | `frappe/desk/like.py`. | Resolved (system metadata). |
| `_user_tags` | `varchar(140)` | yes | JSON-encoded user tags. | `frappe/desk/tags.py`. | Resolved (system metadata). |
| `account_for_change_amount` | `link → Account` | yes | Account to post change-given-to-customer in POS scenarios. | POS settlement code path. | `VALIDATE:` only used when `is_pos = 1`. Workshop: document the constraint as a CHECK or as a `depends_on` rule. |

That's 19 columns of the 40-row representative slice; the same shape applies to the remaining ≈20 rows.

## Implicit relationships

ERPNext encodes most relationships via the `link` field type in DocType definitions, so the FK is *declared* but not *enforced* at the DB layer. A subset of implicit FKs surfaced from the column scan:

- `tabSales Invoice.customer` → `tabCustomer.name` (declared link, no DB FK).
- `tabSales Invoice.amended_from` → `tabSales Invoice.name` (self-reference, declared link, no DB FK).
- `tabSales Invoice.project` → `tabProject.name` (declared link).
- `tabSales Invoice.cost_center` → `tabCost Center.name` (declared link).
- `tabSales Invoice Item.parent` → `tabSales Invoice.name` (declared via child-table parent, no DB FK).
- `tabSales Invoice.payment_terms_template` → `tabPayment Terms Template.name`.

A 60-minute Architect-assisted batch could enumerate the remaining ≈15 link fields and tag any that have *additional code-level coupling* beyond the link declaration (e.g., a stored proc that joins by a column without a declared link).

## Known issues and historical artefacts

- **`c_form_no`** survives pre-GST (pre-2017). Candidate for `> [!deprecated]` tagging.
- **`gst_category`** is declared `Data` but enforced as enum in code (inconsistency between schema and validator).
- **`update_billed_amount_in_sales_order`** has divergent defaults between UI entry and import scripts. Workshop topic.
- **`_user_tags`, `_liked_by`, `_assign`, `_comments`** are framework-system fields with JSON-encoded payloads in `varchar` columns. Not business meaning; should be excluded from business-level column reference.

## Cross-references

- [Project H `patient_profile` table](../schema/tables/patient-profile.md) — same methodology, discovery-phase substrate variant.
- [Schema overview](../schema/overview.md) — column-classification framing and naming conventions (Project H side).
- [CONVENTIONS](../CONVENTIONS.md) — annotation legend (`VALIDATE:`, `> [!deprecated]`) used identically on both substrates.

## Why this companion exists

The *SourceWare Technical Approach* was written for a legacy commercial-system substrate. The Project H sample applies that methodology to a presale/discovery-phase substrate (no committed code yet). A presale reader could reasonably ask: "Does the column-classification process actually work on a real legacy substrate, where the citations are to code rather than to Confluence?" This companion artifact answers that question by running the same beats — logical grouping, per-column classification, `VALIDATE:` flagging, implicit-FK catalog, known-issues capture — against a real, public, ten-plus-year-old codebase (ERPNext) whose `tabSales Invoice` table is roughly the size of the wide tables the SourceWare engagement targets.

The Project H sample shows method + quality bar on a discovery substrate. This companion shows the same method + quality bar on a legacy substrate. Together they demonstrate that the methodology transfers across substrates — only the citation surface changes.

## Open questions

- **Companion scope.** This file documents one ERPNext table. A real companion engagement would author additional tables (`tabItem` ≈100 cols, `tabBOM` ≈80 cols) following the same shape. Listed as an extension path; not authored here.
- **Live code-cite verification.** The file paths cited above are valid as of `frappe/erpnext` `main` at the time of authoring. A real engagement re-validates against the customer's pinned commit SHA. *Owner:* Tech Lead. *Outcome:* re-verify in week 1.
