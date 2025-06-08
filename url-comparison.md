# MoneyWorks API URL Format Issue

## Current mw-core Implementation (WRONG)

The current `MoneyWorksApiService.export()` method constructs URLs like this:

```
http://hjonck-pro.local:6710/REST/AgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export/table=account&limit=3&format=xml-verbose
```

**Problem**: Uses `/export/table=account&` instead of `/export?table=account&`

## MoneyWorks REST API Specification (CORRECT)

According to the official MoneyWorks REST API specification, URLs should be:

```
http://hjonck-pro.local:6710/REST/AgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=account&limit=3&format=xml-verbose
```

**Correct Format**: Uses `/export?table=account&` with proper query parameters

## The Fix Required

In `packages/api/src/services/moneyworks-api.service.ts`, line 329:

**CHANGE FROM:**
```typescript
const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
```

**CHANGE TO:**
```typescript
const url = `${this.getBaseUrl()}/export?table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
```

The same fix is needed on line 433 in the same file.

## Why This Matters

The MoneyWorks DataCentre server expects specific URL patterns. Using `/export/table=` instead of `/export?table=` causes the server to return "DoConnect failed -43" because it can't parse the malformed URL endpoint.