# Google Ads API — Basic access application (DRAFT, do not submit yet)

Ruling (2026-09-13): apply only after (1) the HOMEGRWN MCC exists, (2) at least
one client account is manager-linked, (3) the dashboard is demo-able. Premature
applications for third-party tooling get rejected and re-applying is slower.

## Answers for the API Center form

**Company / website:** HOMEGRWN — https://homegrwndigital.com
**Contact:** connect@homegrwndigital.com

**Tool name:** Ads Driver by HOMEGRWN

**Who uses the tool:** HOMEGRWN's own staff only. Clients do not log in to the
tool. Client Google Ads accounts are linked under our manager account via
standard manager-link invitations that the client accepts in their own account.

**What the tool does (truthful as of the build):** an internal reporting and
audit application for accounts under our manager account. It pulls read-only
performance data (campaigns, keywords, search terms, conversion actions,
geo/schedule settings), evaluates it against vertical-specific rules for home
services and personal-injury law (call tracking, service radius, seasonality,
negative-keyword hygiene, conversion-action integrity), and produces
recommendations that a human reviews. It imports offline conversions (booked
jobs / signed cases) so bidding can optimize toward real outcomes. Change
proposals (e.g. negative-keyword lists) are exported for human application;
the tool does not currently mutate accounts.

**API services used:** GoogleAdsService (search/searchStream) for reporting;
ConversionUploadService / OfflineUserDataJobService for offline conversion
import; CustomerService to enumerate linked accounts. Expected volume: well
under Basic access limits (a scheduled daily pull per linked account).

**Required Minimum Functionality:** not applicable as an external tool — the
application is internal-use, operated by our staff for accounts under our
manager account. If we later expose it to clients, we will reapply with RMF
coverage documented.

**Compliance:** OAuth 2.0 with a refresh token held server-side; developer token
and credentials stored in environment variables only; every API write path (when
enabled) is human-approved with an audit log; we adhere to the Google Ads API
Terms and the Required Minimum Functionality policy as applicable.
