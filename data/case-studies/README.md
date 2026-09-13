# Case-study tenants (CSV)

Drop exported Google Ads tables into a folder here and the dashboard
(`app.homegrwndigital.com`, surface `app`) audits it like a live account —
same knowledge packs, same findings, same change-sets. This is how a prospect
or a pre-API client becomes a tenant before HOMEGRWN has its own MCC token.

```
data/case-studies/
  README.md            this file
  TEMPLATE.csv         column dictionary (machine-checked against the mapper)
  <tenant-slug>/       one folder per account — the slug is the tenant id
    campaigns.csv      one row per campaign          (the one that matters)
    keywords.csv       one row per keyword           (optional)
    search_terms.csv   one row per search term       (optional; junk-traffic rules need it)
    conversions.csv    one row per conversion action (optional; tracking rules need it)
    tenant.json        optional metadata (see below)
```

Folder names: letters, digits, `-`, `_`, `.`; must not start with `_` or `.`
(those are skipped) and must not collide with a built-in fixture id
(`pi-001`, `hs-001`, `pi-clean`). A folder appears in the tenant switcher as
soon as it holds at least one of the four tables or a `tenant.json`.

## How to export from the Google Ads UI

1. **Campaigns** → Campaigns table → Download → **CSV**. Keep the default
   columns; add *Bid strategy type*, *Budget*, *Conv. value* if they are hidden.
2. **Keywords** → Search keywords table → Download → CSV.
3. **Search terms** → Insights & reports → Search terms → Download → CSV.
4. **Conversions** → Goals → Conversions → Summary table → Download → CSV.

Rename each file to the exact names above. Google's exports are accepted
as-is: the title/date-range rows above the header, the trailing "Total" row,
`$1,234.56` money, ` --` for blanks, and the UTF-8 BOM are all handled.
Choose **CSV**, not Excel/TSV. Set the date range to the window you want
audited and record it in `tenant.json` (`windowDays`) so spend normalizes to
30 days correctly.

Headers are matched case-insensitively after punctuation is folded to `_`
(`Conv. value` → `conv_value`, `Impr.` → `impr`). Every accepted alias is
listed in `TEMPLATE.csv`; anything not listed is ignored, never an error.

## Columns

Canonical names below; `TEMPLATE.csv` carries the full alias list, an example
value, and notes per column. Money columns strip currency symbols and
thousands separators. Lists split on `;` or `|`. Booleans accept
`yes/no`, `true/false`, `1/0`.

### campaigns.csv

| column | required | notes |
|---|---|---|
| `campaign` | yes | Name. Joins the other tables. |
| `campaign_id` | | Stable id; defaults to a slug of the name. |
| `campaign_state` | | Enabled / Paused / Removed. Only paused/removed/ended count as off. |
| `campaign_type` | | Search, Performance Max, Display, Video, Shopping, Local Services, Demand Gen. |
| `bid_strategy_type` | | Manual CPC, Maximize clicks, Maximize conversions, Target CPA, Target ROAS, Target impression share. "Maximize conversions (Target CPA)" → Target CPA. |
| `budget` | | Average daily budget. |
| `clicks`, `impressions`, `cost`, `conversions`, `conv_value` | | Window totals. |
| `locations` | | `Phoenix, AZ; Mesa, AZ` |
| `radius_mi` | | Radius targets in miles, `;`-separated. |
| `national` | | yes when the campaign targets a whole country. |
| `brand` | | yes for a dedicated brand campaign. Defaults to "name contains *brand*". |

### keywords.csv

`campaign` (yes) · `campaign_id` · `keyword` (yes) · `match_type` (Exact / Phrase / Broad) · `clicks` · `cost` · `conversions` · `quality_score`

### search_terms.csv

`campaign` (yes) · `campaign_id` · `search_term` (yes) · `clicks` · `cost` · `conversions`

### conversions.csv

`conversion_action` (yes) · `category` (Submit lead form, Phone call lead, Purchase, Qualified lead, Converted lead, Book appointment…) · `source` (Website, Calls from ads, Import from clicks…) · `counting` (One / Every; blank = Every) · `primary` (yes/no; defaults to yes when the column is absent) · `call_duration_sec` · `verified` (override) · `conversions` · `conv_value`

The source + category text is folded onto the same taxonomy the live API
mapper uses (`website-form`, `phone-call`, `imported-offline`, `purchase`, …)
so a CSV tenant and a live tenant produce identical findings for identical data.

## tenant.json (optional)

```json
{
  "name": "Acme Comfort HVAC",
  "currency": "USD",
  "windowDays": 30,
  "subNiche": "hvac",
  "servesLocations": ["Phoenix, AZ"]
}
```

- `name` — display name (defaults to the folder slug).
- `windowDays` — days the export covers; spend is normalized to 30 days.
- `subNiche` — drives pack suggestion (`hvac`, `roofing`, `car-accident`,
  `truck-accident`, `mass-tort`, …). Without it the account name is sniffed.
- `servesLocations` — jurisdictions the business can serve (geo rules).

## Partial data

Missing files never crash. The account loads with whatever is present, the
dashboard shows a **Partial data** badge listing what is missing, and every
inference the mapper made (stub campaigns, rolled-up metrics, dropped rows)
is spelled out in the ingest warnings on the account page.

- No `campaigns.csv` → campaigns are inferred from keyword/search-term rows
  with clicks/cost/conversions rolled up from those rows (flagged).
- A child row naming a campaign that is not in `campaigns.csv` → a stub
  campaign is added (flagged).
- No `search_terms.csv` → junk-traffic and negative-keyword findings cannot
  fire. No `conversions.csv` → tracking-integrity findings cannot fire.

## Where this lives in code

- Mapper + adapter: `src/lib/ads/csv-datasource.ts` (pure `buildCsvSnapshot`,
  tested in `csv-datasource.test.ts`; the test also asserts `TEMPLATE.csv`
  matches the column registry).
- Tenant registry: `src/app/app/_lib/tenants.ts`.
- Override the root folder with `CASE_STUDIES_DIR=/path` (defaults to
  `data/case-studies`).

Nothing under this folder except `README.md` and `TEMPLATE.csv` should be
committed unless the client has agreed to have their account data in the repo.
