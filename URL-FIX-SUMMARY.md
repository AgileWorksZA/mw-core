# MoneyWorks API Authentication & URL Fix Summary

## ✅ **COMPLETELY RESOLVED: Authentication & API Access**

### Authentication Issues Fixed

#### 1. **Document Password Correction**
**WRONG (initial config):**
```json
{
  "username": "support",
  "password": "shalom1024"
}
```

**CORRECT (fixed config):**
```json
{
  "username": "support", 
  "password": "support1024"
}
```

**Key Discovery**: The document password was `support1024`, not `shalom1024`. This was the primary cause of "DoConnect failed -1" authentication errors.

#### 2. **Dual Authorization Header Format**
**Working Implementation:**
```typescript
// Return dual headers as array (Axios format for duplicate header names)
return {
  Authorization: [folderAuth, documentAuth],
};
```

Where:
- `folderAuth`: `Basic ${base64("Agileworks:Datacentre:shalom1024")}`
- `documentAuth`: `Basic ${base64("support:Document:support1024")}`

#### 3. **URL Structure for Folder-Based Documents**
**CORRECT URL Format:**
```
http://hjonck-pro.local:6710/REST/Agileworks%2fAgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=name&limit=5&format=xml-verbose
```

**Key Components:**
- Folder path: `Agileworks%2f` (URL-encoded with %2f separator)
- Document name: `AgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks`
- Query parameters: `?table=name&limit=5&format=xml-verbose`

### URL Construction Fix (Also Required)
Changed in `packages/api/src/services/moneyworks-api.service.ts`:

```typescript
// BEFORE:
const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;

// AFTER:
const url = `${this.getBaseUrl()}/export?table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
```

## 🎉 **Current Status: FULLY WORKING**

### ✅ **All Tests Passing**
```
✅ Basic Server Connectivity (MoneyWorks 9.2.1b5)
✅ Authentication Headers (correct credentials loaded)
✅ Simple Expression Evaluation (1+1 = 2)
✅ Date Expression Evaluation (Today() = 2025/06/08)
✅ Database Tables List (31 tables found)
✅ Account Table Access (3/174 accounts retrieved)
✅ Subfolder URL Format Test (folder structure working)
✅ Proper Dual Header Authentication (array format confirmed)
✅ Protocol Support (HTTP working correctly)
```

### ✅ **API Endpoints Working**
- **Direct MoneyWorks API**: All functions operational
- **Web API Endpoints**: Successfully retrieving data (180 name records)
- **MCP Server**: Ready for Claude Code integration
- **Authentication Model**: Fully validated and documented

### ✅ **Validated Authentication Model**
```typescript
// Final working configuration
{
  "host": "hjonck-pro.local",
  "port": 6710,
  "protocol": "http",
  "dataFile": "AgileWorks Information Systems Main GL To Fix.moneyworks",
  "username": "support",
  "password": "support1024",
  "folderAuth": {
    "folderName": "Agileworks", 
    "password": "shalom1024"
  }
}
```

## 🔧 **Key Technical Discoveries**

### 1. **Dual Authentication Requirements**
MoneyWorks folder-based documents require TWO separate Authorization headers:
- **Folder-level auth**: `Agileworks:Datacentre:shalom1024`
- **Document-level auth**: `support:Document:support1024`

### 2. **Header Array Format**
Axios handles duplicate header names correctly when passed as arrays:
```typescript
headers: {
  Authorization: [folderAuth, documentAuth]
}
```

### 3. **URL Encoding for Folder Paths**
Folder paths in URLs must use `%2f` encoding instead of `/`:
- **Correct**: `/REST/Agileworks%2fDocument.moneyworks`
- **Wrong**: `/REST/Agileworks/Document.moneyworks`

### 4. **Working CURL Example**
```bash
curl -v \
  -H "Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=" \
  -H "Authorization: Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==" \
  "http://hjonck-pro.local:6710/REST/Agileworks%2fAgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=name&limit=5&format=xml-verbose"
```

## 📋 **For Claude MCP Server Integration**

**Status**: ✅ **READY FOR PRODUCTION**

The MoneyWorks authentication and API access are now fully operational:
- All authentication issues resolved
- URL construction working correctly  
- Data retrieval confirmed (180+ name records accessible)
- Dual header format validated
- Protocol support configured
- MCP server successfully connecting to MoneyWorks

The integration is complete and ready for Claude Code sessions.