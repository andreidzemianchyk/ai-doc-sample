# ADR-0007 — Integration with FDB clinical drug database

## Status

**Accepted.** Source page `433066194`.

## Context

Project H's intake and screener assessments need to capture drug names, allergens, contraindications, and dose-related data in a normalised, code-bearing form so the downstream clinician report and recommendation logic can reason consistently across patients and clinics. Building the dictionaries internally is not viable — clinical drug data must be sourced from a maintained, regulated database.

## Decision

Integrate the **FDB clinical drug information** suite as the source of truth for drug names, allergens, indications, contraindications, interactions, adverse effects, dose screening, and reference lookups (ICD-10, age, gender, pregnancy, lactation). Integration is via the FDB Web Service API. The following services are in scope for MVP: Foundation Concepts, Pregnancy, Lactation, Age, Gender, Drug Disease Contraindications, Drug Interactions, Drug Allergy, Drug Indications, Adverse Drug Effects, Dose Screening, ICD-10, and IPEM (Patient Education Monographs). FDB-coded values are stored in `patient_profile.*_fdb_id` columns (see [schema convention](../../schema/overview.md#naming-conventions)) and surfaced as patient-facing labels in intake answers.

## Alternatives considered

- **First Databank flat-file ingestion** (no Web Service). Pros: simpler runtime — no live dependency. Cons: drug names go stale between flat-file refreshes; license terms favour Web Service for the use case. *Rejected* for live screening; flat files retained for files that aren't exposed via the Web Service (Drug Application File, Patient Safety Programs, Cost of Therapy).
- **In-house drug dictionary curated from public sources (e.g. RxNorm).** Pros: no vendor lock-in or license cost. Cons: outside Project H's scope and regulatory comfort zone; would push compliance and currency burden onto the team. *Rejected.*

## Consequences

### Positive

- Single drug-data vendor across drug-name lookup, allergy screening, dose screening, and recommendation gating — no impedance mismatch.
- IPEM gives the team a path to patient-facing educational content with consistent provenance.
- Static dictionaries (gender, pregnancy contraindication severity levels, conditions) can be linked to FDB IDs without runtime calls.

### Negative

- **NDA / contract dependency.** FDB integration is gated on NDA completion; see Open question. Risk if NDA slips past Week-1.
- Per-request latency on FDB Web Service calls. Mitigated by the Reference data caching policy in [ADR-0009](0009-reference-data.md).
- License terms for non-Web-Service files (DAF, PSP, COT) require separate handling.

### Open

- **NDA resolution timeline.** *Owner:* Project Manager. *Outcome:* Week-1 status check.
- **IPEM language support.** Which languages does Project H need for patient education content? *Owner:* Product. *Outcome:* policy decision before patient-facing IPEM content ships.

## Notes

Sourced from Confluence page `433066194`. Caching/refresh model for FDB-derived dictionaries is documented in [ADR-0009](0009-reference-data.md). FDB-coded column-naming convention (`*_fdb_id`) is in [schema/overview.md](../../schema/overview.md#naming-conventions).
