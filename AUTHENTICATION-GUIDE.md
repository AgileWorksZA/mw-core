# MoneyWorks Authentication Guide

This guide documents the complete MoneyWorks API authentication model based on validated testing and implementation.

## 🎯 **Authentication Model Overview**

MoneyWorks DataCentre REST API supports two authentication modes:

1. **Document-only authentication** - For documents at the server root level
2. **Dual authentication** - For documents in folders (most common)

## ✅ **Dual Authentication (Folder + Document)**

### Required Configuration

```json
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

### Credential Format

**Document Credentials:**
```
Format: username:Document:password
Example: support:Document:support1024
Base64: c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==
```

**Folder Credentials:**
```
Format: folderName:Datacentre:password
Example: Agileworks:Datacentre:shalom1024
Base64: QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=
```

### HTTP Header Implementation

#### Method 1: Array Format (Recommended for Axios)
```typescript
headers: {
  Authorization: [
    "Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=",
    "Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA=="
  ]
}
```

#### Method 2: Comma-separated Single Header
```typescript
headers: {
  Authorization: "Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=, Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA=="
}
```

#### Method 3: Duplicate Headers (CURL)
```bash
curl -H "Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=" \
     -H "Authorization: Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==" \
     "http://hjonck-pro.local:6710/REST/Agileworks%2fAgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=name&limit=5"
```

## 🔧 **URL Structure for Folder Documents**

### Correct Format
```
http://hjonck-pro.local:6710/REST/{folder}%2f{document}.moneyworks/{endpoint}?{params}
```

### Real Example
```
http://hjonck-pro.local:6710/REST/Agileworks%2fAgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=name&limit=5&format=xml-verbose
```

### Key Requirements
- Folder path uses `%2f` encoding (not regular `/`)
- Document name is URL-encoded
- Query parameters start with `?`
- Multiple parameters separated with `&`

## 🚨 **Common Issues & Solutions**

### 1. "DoConnect failed -1" 
**Cause**: Incorrect document password  
**Solution**: Verify the exact password for your user account

### 2. "DoConnect failed -43"
**Cause**: Malformed URL structure  
**Solution**: Ensure query parameters use `?` not `/`

### 3. "Request failed with status code 404"
**Cause**: Wrong URL format (missing folder path)  
**Solution**: Use folder-based URL structure for documents in folders

### 4. Authentication header issues
**Cause**: Incorrect credential format or encoding  
**Solution**: Use exact format `username:Document:password` and `folderName:Datacentre:password`

## 📋 **Implementation Code Examples**

### TypeScript/Axios Implementation
```typescript
class MoneyWorksApiService {
  private createAuthHeaders() {
    const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
    const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

    if (this.config.folderAuth) {
      const { folderName, password } = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

      return {
        Authorization: [folderAuth, documentAuth],
      };
    }

    return {
      Authorization: documentAuth,
    };
  }

  private getBaseUrl() {
    const protocol = this.config.protocol || "http";
    
    if (this.config.folderAuth) {
      const folderName = this.config.folderAuth.folderName;
      const folderPathEncoded = encodeURIComponent(folderName).replace('/', '%2f');
      const docNameEncoded = encodeURIComponent(this.config.dataFile);
      return `${protocol}://${this.config.host}:${this.config.port}/REST/${folderPathEncoded}%2f${docNameEncoded}`;
    }
    
    return `${protocol}://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
  }
}
```

### Python Implementation
```python
import base64
import requests

def create_auth_headers(username, doc_password, folder_name, folder_password):
    # Document credentials
    doc_creds = f"{username}:Document:{doc_password}"
    doc_auth = base64.b64encode(doc_creds.encode()).decode()
    
    # Folder credentials  
    folder_creds = f"{folder_name}:Datacentre:{folder_password}"
    folder_auth = base64.b64encode(folder_creds.encode()).decode()
    
    return {
        'Authorization': f"Basic {folder_auth}, Basic {doc_auth}"
    }

def build_url(host, port, folder_name, document_name):
    folder_encoded = urllib.parse.quote(folder_name).replace('/', '%2f')
    doc_encoded = urllib.parse.quote(document_name)
    return f"http://{host}:{port}/REST/{folder_encoded}%2f{doc_encoded}"
```

## ✅ **Validation Tests**

### Working CURL Test
```bash
# Test server version (no auth required)
curl "http://hjonck-pro.local:6710/REST/server/version"

# Test document access with dual auth
curl -v \
  -H "Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=" \
  -H "Authorization: Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==" \
  "http://hjonck-pro.local:6710/REST/Agileworks%2fAgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/export?table=name&limit=5&format=xml-verbose"
```

### Expected Response
```xml
<?xml version="1.0"?>
<table name="name" count="5" found="180" start="0">
  <name>
    <sequencenumber>682</sequencenumber>
    <code>MON002</code>
    <name>Moneyworks Finance</name>
    ...
  </name>
  ...
</table>
```

## 🔐 **Security Notes**

1. **Never log credentials** in plain text
2. **Use HTTPS** in production when available
3. **Store passwords securely** (environment variables, key management)
4. **Validate SSL certificates** in production environments
5. **Use minimal permissions** for API user accounts

## 📚 **Reference Documentation**

- MoneyWorks REST API Specification: `/developer/moneyworks-datacentre-rest-api/`
- Working implementation: `packages/api/src/services/moneyworks-api.service.ts`
- Test suite: `packages/api/src/cli/tools/test-connection.ts`
- Authentication validation: Complete in `URL-FIX-SUMMARY.md`

---

**Status**: ✅ **FULLY VALIDATED AND WORKING**  
**Last Updated**: June 8, 2025  
**Tested Against**: MoneyWorks DataCentre 9.2.1b5