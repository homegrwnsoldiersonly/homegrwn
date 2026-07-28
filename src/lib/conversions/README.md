# Offline conversion import

Closes the loop the PI pack flags as critical: real outcomes (signed cases,
booked jobs) flow back into Google Ads as the signal bidding optimizes toward,
instead of raw form-fills.

## Recommend-first, even for writes

The pipeline always produces a reviewable `ImportPlan` first:

```
CSV (intake/CRM export)
  → parseOutcomeCsv()     flexible headers (signed_at/case_value/case_id …)
  → buildImportPlan()     validate every row, dedupe, total up   [PURE]
  → dry-run preview       scripts/import-conversions.ts (default)
  → --apply               ConversionUploader → UploadClickConversions
```

Everything Google enforces server-side that we can check locally is checked in
`build.ts` — click id presence/format, timestamp normalization to Google's
`yyyy-mm-dd hh:mm:ss±hh:mm` (naive times get a configured UTC offset), the
90-day click-conversion window, future dates, value/currency sanity, and
duplicate rows — so operators see problems in the preview, not as opaque
partial-failure errors after upload.

`upload` always sets `partial_failure: true`: Google accepts good rows and
reports bad ones, which the CLI surfaces and exits non-zero on.

## Usage

```bash
npx tsx scripts/import-conversions.ts intake-export.csv \
  --customer 123-456-7890 --action 987654321 --tz -07:00        # dry run
# review the plan, then:
npx tsx scripts/import-conversions.ts intake-export.csv \
  --customer 123-456-7890 --action 987654321 --tz -07:00 --apply
```

`--action` is the numeric id of the "Signed Case" (or "Booked Job") conversion
action in Google Ads — create it as type *Import*, category *Qualified lead* /
*Converted lead*, so the ingestion mapper recognizes it as a verified outcome.

Template: `docs/templates/signed-cases.example.csv`. The CSV needs a click id
column (`gclid`), a time column (`signed_at`, `booked_at`, …), `value`, and
`currency`; `case_id`/`job_id` enables safe re-uploads (dedupe + Google-side
order_id dedupe).

## Capturing gclids

This only works if the intake system stores the `gclid` from the ad click
(URL param → hidden form field / CRM field) alongside each lead. That capture
is per-client setup and is the price of admission for value-based bidding.
