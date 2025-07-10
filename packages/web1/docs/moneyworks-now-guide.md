# MoneyWorks NOW Integration Guide

## Overview
MoneyWorks NOW is a cloud-hosted version of MoneyWorks that allows you to access multiple data files through a single account. This guide explains how to connect to MoneyWorks NOW and manage your cloud-hosted files.

## Features
- Connect to MoneyWorks NOW accounts
- Multi-select files to connect
- Automatic sync and refresh
- Manage multiple NOW accounts
- Seamless integration with existing features

## Getting Started

### 1. Adding a MoneyWorks NOW Account

1. Navigate to **Connections** page
2. Click **"Connect to NOW"** button
3. Enter your NOW account details:
   - **Account Name**: A friendly name for this NOW account
   - **Username**: Your MoneyWorks NOW email/username
   - **Password**: Your MoneyWorks NOW password
4. Click **"Connect & Select Files"**

### 2. Selecting Files

After successful authentication, you'll see all available files in your NOW account:

1. Review the list of available files
2. Each file shows:
   - Company name
   - Server location
   - Data file path
   - Last modified date (if available)
3. Select files to connect (minimum 1):
   - Click individual checkboxes
   - Use "Select All" / "Deselect All" buttons
4. Click **"Create X Connections"** to create connections

### 3. Using NOW Connections

NOW connections work exactly like regular Data Centre connections:

- They appear in your connections list with a cloud icon
- Switch between connections using "Use This" button
- Access all MoneyWorks features (Tax Rates, Company info, etc.)
- NOW connections are marked with "(NOW)" label

### 4. Managing NOW Accounts

Navigate to **Connections** > **"Manage NOW Accounts"** to:

- View all your NOW accounts
- See connected files count
- Check last sync date
- Refresh connections
- Delete accounts

### 5. Refreshing/Syncing

Keep your connections up to date with changes in MoneyWorks NOW:

1. Go to NOW Accounts page
2. Click **"Refresh & Sync"** on an account
3. Review changes:
   - **New Files**: Files added to NOW since last sync
   - **Missing Files**: Files no longer available
   - **Unchanged**: Files that remain the same
4. Select changes to apply
5. Click **"Apply Changes"**

## Best Practices

### Organization
- Use descriptive account names
- Group related companies in the same NOW account
- Regularly sync to catch changes

### Security
- NOW credentials are encrypted
- Each user has their own NOW accounts
- Connections are user-specific

### Performance
- Only connect to files you actively use
- Remove connections for unused files
- Refresh periodically, not constantly

## Troubleshooting

### Authentication Failed
- Verify your NOW username/password
- Check if your NOW account is active
- Ensure you have internet connectivity

### No Files Found
- Confirm files exist in your NOW account
- Check NOW account permissions
- Contact your MoneyWorks administrator

### Sync Issues
- Missing files may have been archived
- New files need proper permissions
- Network issues can cause sync failures

### Connection Errors
- NOW connections require internet access
- Firewall may block NOW servers
- VPN might interfere with connections

## Technical Details

### Data Storage
- NOW credentials stored encrypted
- Connection details cached locally
- No sensitive data in browser storage

### Sync Process
1. Authenticates with NOW
2. Fetches current file list
3. Compares with local connections
4. Identifies changes
5. Updates connections as needed

### API Integration
- Uses MoneyWorks NOW REST API
- Supports token refresh (if implemented)
- Handles connection pooling

## FAQ

**Q: Can I have multiple NOW accounts?**
A: Yes, you can add multiple NOW accounts and manage them separately.

**Q: What happens to my connections if a file is removed from NOW?**
A: The sync process will detect missing files and allow you to remove those connections.

**Q: Are NOW connections slower than Data Centre?**
A: Performance depends on your internet connection and NOW server location.

**Q: Can I mix NOW and Data Centre connections?**
A: Yes, you can have both types of connections and switch between them.

**Q: How often should I sync?**
A: Sync when you know changes have been made, or weekly for regular updates.

## Support

For issues specific to MoneyWorks NOW:
- Check NOW server status
- Verify account permissions
- Contact MoneyWorks support

For integration issues:
- Check application logs
- Verify database migrations
- Review error messages