# Naming inconsistencies

Spec-level naming inconsistencies discovered while applying the column-classification methodology of TA §5.1 to the [`patient_profile`](tables/patient-profile.md) wide-table doc. Each entry is a candidate for a `> [!warning]` callout in the relevant table doc, and a workshop topic for week 1 of implementation. Surfacing them here is lower-cost than discovering them at PR-review time.

## Catalogue

| # | Inconsistency | Location in source | Effect | Suggested resolution |
| --- | --- | --- | --- | --- |
| 1 | `race` and `ethnicity` sometimes collapsed, sometimes separate | Epic-2 F1 US-1.1 (page `425558452`) lists "race / ethnicity" as one bullet; AVD §1.2 enumeration treats them separately | Ambiguous storage shape — single column with concatenated value, or two columns? Affects FHIR mapping (EPIC returns them as separate `Observation`s) | Workshop with Compliance Engineer; align to OMB-1997 categories (most common US healthcare standard); two columns. |
| 2 | `height` unit unspecified | Epic-2 F1 US-1.1 lists "height" with no unit; EPIC FHIR `Observation` supports both cm and inches | Conversion code locality not pinned (frontend vs backend); display unit not pinned. A clinician seeing "Patient height: 65" cannot tell if it's centimetres (impossible) or inches (5'5") | Store metric at the DB layer (FHIR-best-practice), convert at presentation. Add a unit-conversion utility used by both Patient Mobile App and the report PDF generator. |
| 3 | AVD §3 "Architecture Drivers" has §§3.1, 3.2, 3.4 — no §3.3 | Confluence parent page `420911666` | Either a published page is missing or the numbering was renumbered without resequencing. Readers will second-guess whether they have the full set | Verify with Architect; either author the missing page or renumber to fill the gap. |
| 4 | AVD §5 "Operation Plan" has §§5.1–5.3, 5.5 — no §5.4 | Confluence parent page `420911711` | Same problem as #3 | Same fix as #3. |
| 5 | `mychart_token_ref` vs `refresh_token_ref` vs `access_token_ref` | Brief column-reference proposal in [`patient_profile`](tables/patient-profile.md) | Three nearby columns with three suffixes for the same kind of opaque reference (an encrypted opaque handle to an external resource). A developer or agent maintaining the columns will assume the suffix carries semantic weight | Workshop: pick one suffix convention (`_ref` for all, OR `_id` for all). Document the chosen convention in [schema/overview.md §Naming conventions](overview.md#naming-conventions). |
| 6 | `consents_catalog.version` target table not yet named | [relationships.md](relationships.md) row | Implicit FK target without a committed table. Affects whether [ADR-0001](../architecture/decisions/0001-mychart-as-per-clinic-sso.md)'s "consent timestamp + version" rule is implementable | Author a `schema/tables/consents-catalog.md` stub in the next iteration; commit `consents_catalog` DDL. |
| 7 | Plural-vs-singular table naming | `patient_profile` (singular) vs `intake_responses` / `game_results` / `reports` (plural) in proposed schema | Style inconsistency — readers will lose time looking for `patient_profiles` or `intake_response`. The current rationale ("one row per patient" for `patient_profile`) is undocumented | Document the rule in [schema/overview.md §Naming conventions](overview.md#naming-conventions): plural by default; singular when "one row per entity" is the contract. |

## Process anchor

This file is the **output of the column-classification methodology** described in TA §5.1, applied to Project H. The methodology surfaces three kinds of artefact:

1. Per-column `VALIDATE:` flags in the table doc → workshop topics → resolved into rules or open questions.
2. Implicit FK candidates → cross-referenced in [relationships.md](relationships.md).
3. **Naming inconsistencies and spec-process artefacts** → this file.

In a real engagement, this file evolves throughout the project — new inconsistencies discovered during ongoing column-classification batches are added here, and resolved ones move to "Resolved" archive at the bottom. For this sample, the seven entries above are the snapshot at discovery.

## Cross-references

- [Patient profile table](tables/patient-profile.md) — most of these inconsistencies surface as per-column `VALIDATE:` flags there.
- [Relationships](relationships.md) — inconsistency #6 is also the trigger for one of the `VALIDATE:` rows there.
- [Schema overview — Naming conventions](overview.md#naming-conventions) — captures the rules that resolve #5 and #7 once the workshop is held.
- [Architecture overview — Key design decisions](../architecture/overview.md#key-design-decisions) — D-codes are the source for some of the source-page numbering issues called out in #3 and #4.

## Open questions

- **AVD section-numbering gaps audit.** Are #3 and #4 the only missing-section gaps, or are there more across the AVD subtree? *Owner:* Architect. *Outcome:* sweep all AVD parent pages in week 1.
- **Ethnicity coding standard.** OMB-1997 vs US Census 2020 vs free-text. *Owner:* Compliance Engineer. *Outcome:* policy decision before patient-profile DDL.
- **`_ref` vs `_id` suffix policy.** Listed as #5 above. *Owner:* Architect + Tech Lead. *Outcome:* CONVENTIONS update + table doc updates.
