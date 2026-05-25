# ADR-0013 — Sending PDF report to EPIC via the HL7 Incoming Ancillary Results / Orders interface

## Status

**Accepted.** Source page `443839739`. Companion to [ADR-0014](0014-mirth-connect-deployment.md) (Mirth Connect deployment) — both pages were numbered ADR-12 in the source corpus.

## Context

The clinician PDF report is the primary deliverable from Project H back to the clinical workflow. EPIC exposes several inbound channels for delivering structured and unstructured results; ORU^R01 over HL7 v2.3 is the canonical path for ancillary results carrying an encapsulated document. The alternative — pushing the PDF as a FHIR `DocumentReference` resource directly to EPIC — depends on per-clinic SMART FHIR app configuration ([ADR-0017](0017-epic-smart-fhir-production-config.md)) and on the clinic enabling the inbound DocumentReference endpoint, which not every clinic offers.

## Decision

Send the PDF report to EPIC as an HL7 v2.3 `ORU^R01` message with the PDF Base64-encoded inside an `OBX` segment of type `ED` (Encapsulated Data). Message structure:

- **MSH** identifies sender (`PROJECTH`), receiver (`EPIC`), message type (`ORU^R01`), processing flag (`P` / `D`), HL7 version (`2.3`), and a `MSG{report_id}` control ID for ACK correlation.
- **PID** carries the EPIC MRN in PID-3 plus patient name, DOB, sex from EPIC demographics.
- **PV1** carries the encounter context with the report ID encoded as both PV1-1 and PV1-19 (`EN{report_id}`).
- **ORC** sets `RE` (Result) with `ORC{report_id}^PROJECTH` as the order ID.
- **OBR** carries `OBR{report_id}^PATIENT PROJECTH REPORT^LOCAL` as the test code, using a local coding system since the report is custom.
- **OBX #1** is a `TX` summary line.
- **OBX #2** is `ED` with `^Application^PDF^Base64^<BASE64_PDF>` as the value.

Project H listens for the ACK on the same channel: positive `ACK^R01` with `MSA-1=AA`, negative with `MSA-1=AE` + `MSA-3` carrying the error message + `ERR-2` carrying the HL7 error code.

## Alternatives considered

- **FHIR `DocumentReference` push.** Pros: structured, matches the rest of Project H's EPIC integration. Cons: per-clinic inbound endpoint availability is uneven; HL7 ORU is the universally supported path for ancillary PDFs. *Deferred* — keep the FHIR option open for clinics that support it; default is ORU.
- **Direct SFTP drop into an EPIC-managed share.** Pros: lowest integration overhead. Cons: outside the App Orchard track, no clinical-context binding, no ACK semantics. *Rejected.*

## Consequences

### Positive

- ORU^R01 is the most broadly supported inbound channel in EPIC deployments — works across more clinic configurations than the FHIR push.
- The ACK protocol gives Project H an explicit success / failure signal per message, feeding the Outbound Queue retry logic.
- Local test codes (`OBR-4 = OBR{id}^PATIENT PROJECTH REPORT^LOCAL`) let clinics route the report into a custom In Basket folder without polluting LOINC.

### Negative

- HL7 v2 is not as ergonomic as FHIR; field-by-field encoding is error-prone and tied to a Mirth Connect transformer ([ADR-0014](0014-mirth-connect-deployment.md)).
- `OBX-2 = ED` for PDFs is technically allowed but some EPIC deployments flag it; observed during integration testing.

### Open

- **OBX `ED` acceptance by every target clinic's EPIC instance.** *Owner:* Tech Lead + EPIC integration partner. *Outcome:* per-clinic integration test in sandbox before go-live.
- **Switch to FHIR DocumentReference push** for clinics that support it. *Open* — track per-clinic feature flag.

## Notes

Sourced from Confluence page `443839739`. Deployment of the HL7 transport (Mirth Connect on EC2) is in [ADR-0014](0014-mirth-connect-deployment.md). FHIR-based alternative path is the subject of AVD 4.4.2 Outbound messages (page `420906856`) and depends on [ADR-0017](0017-epic-smart-fhir-production-config.md).
