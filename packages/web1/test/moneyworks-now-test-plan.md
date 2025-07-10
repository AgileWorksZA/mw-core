# MoneyWorks NOW Integration Test Plan

## Overview
This test plan covers the complete MoneyWorks NOW integration feature, including account management, file selection, connection creation, and sync functionality.

## Prerequisites
- MoneyWorks NOW test account credentials
- Access to MoneyWorks NOW with multiple data files
- Running web1 application with database migrations applied

## Test Scenarios

### 1. NOW Account Creation
**Test Steps:**
1. Navigate to `/connections`
2. Click "Connect to NOW" button
3. Fill in NOW account details:
   - Account Name: "Test NOW Account"
   - Username: [NOW username]
   - Password: [NOW password]
4. Click "Connect & Select Files"

**Expected Results:**
- Form validation works (all fields required)
- Loading state shown during authentication
- On success: Redirected to file selection page
- On failure: Error message displayed

### 2. File Selection
**Test Steps:**
1. After successful NOW authentication
2. View list of available files
3. Test "Select All" / "Deselect All" functionality
4. Select specific files (minimum 1)
5. Click "Create X Connections"

**Expected Results:**
- All NOW files displayed with company name, host, port
- Checkbox selection works correctly
- Cannot proceed with 0 files selected
- Loading state during connection creation
- Success: Redirect to connections page with new connections visible

### 3. NOW Connection Display
**Test Steps:**
1. Navigate to `/connections`
2. Identify NOW connections (cloud icon)
3. Verify connection details
4. Test "Use This" functionality

**Expected Results:**
- NOW connections show cloud icon
- "(NOW)" label visible in connection description
- Connection works same as Data Centre connections
- Can switch between NOW and Data Centre connections

### 4. NOW Account Management
**Test Steps:**
1. Navigate to `/connections/now`
2. View NOW account details
3. Check connected files count
4. Test dropdown menu actions

**Expected Results:**
- All NOW accounts listed
- Shows username and last sync date
- Displays count and preview of connected files
- Dropdown menu accessible

### 5. Refresh/Sync Functionality
**Test Steps:**
1. From `/connections/now`, click "Refresh & Sync"
2. Wait for refresh to complete
3. If changes detected, review changes:
   - New files available
   - Missing files
   - Unchanged files count
4. Select files to add/remove
5. Click "Apply Changes"

**Expected Results:**
- Refresh shows loading state
- Changes categorized correctly
- Can select/deselect files to sync
- Apply changes updates connections
- Success message shown

### 6. Delete NOW Account
**Test Steps:**
1. From `/connections/now`, open dropdown menu
2. Click "Delete Account"
3. Confirm deletion

**Expected Results:**
- Confirmation dialog appears
- All associated connections deleted
- Account removed from list
- Success message shown

### 7. Error Handling
**Test Cases:**
- Invalid NOW credentials
- Network timeout during authentication
- NOW service unavailable
- No files available in NOW account
- Connection creation failure

**Expected Results:**
- Appropriate error messages
- No data corruption
- Can retry operations

### 8. Edge Cases
**Test Cases:**
- Create multiple NOW accounts
- NOW account with 50+ files
- Refresh when no changes
- Refresh with only new files
- Refresh with only missing files
- Concurrent operations

## Database Verification
After each test scenario, verify:
1. `mw_now_accounts` table has correct entries
2. `mw_connections` table has correct NOW references
3. Encrypted fields are properly encrypted
4. Foreign key relationships maintained

## Performance Tests
1. Authentication response time < 5 seconds
2. File list loading < 3 seconds
3. Bulk connection creation (10 files) < 10 seconds
4. Refresh operation < 5 seconds

## Security Tests
1. NOW passwords encrypted in database
2. Cannot access other users' NOW accounts
3. API endpoints require authentication
4. No sensitive data in browser console/network

## UI/UX Tests
1. All loading states have spinners
2. Error messages are user-friendly
3. Success feedback is clear
4. Navigation flow is intuitive
5. Mobile responsive

## Integration Tests
1. NOW connections work with existing features:
   - Tax rates loading
   - Company information
   - Data export/import
2. Connection switching works
3. Audit logs created for all operations

## Regression Tests
1. Existing Data Centre connections still work
2. Connection creation form still works
3. No breaking changes to connection API

## Test Data Requirements
- NOW account with at least 3 data files
- One file should be removed during testing (to test missing files)
- One new file should be added during testing (to test new files)

## Success Criteria
- All test scenarios pass
- No console errors
- Performance within acceptable limits
- Security requirements met
- User can complete full workflow without confusion