# Google Sheets Authentication Troubleshooting

This guide helps you resolve common Google Sheets authentication issues.

## Quick Diagnosis

Run these commands in order to diagnose the issue:

```bash
# 1. Verify credentials file
npm run verify:credentials

# 2. Debug authentication step by step
npm run debug:auth

# 3. Test Google Sheets integration
npm run test:sheets
```

## Common Issues and Solutions

### 1. "No key or keyFile set" Error

**Symptoms:**

- Error: `No key or keyFile set`
- Authentication fails during `auth.getAccessToken()`

**Solutions:**

#### A. Check Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `my-sheets-app-467604`
3. Go to "APIs & Services" > "Enabled APIs"
4. Make sure "Google Sheets API" is enabled
5. If not enabled, go to "Library" and search for "Google Sheets API"

#### B. Verify Service Account Permissions

1. Go to "APIs & Services" > "Credentials"
2. Find your service account: `sheet-access@my-sheets-app-467604.iam.gserviceaccount.com`
3. Click on it and go to "Keys" tab
4. Make sure you have a valid JSON key file
5. If not, create a new key

#### C. Check Google Sheets Sharing

1. Open your Google Sheets: `1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA`
2. Click "Share" button
3. Add: `sheet-access@my-sheets-app-467604.iam.gserviceaccount.com`
4. Give "Editor" permissions
5. Uncheck "Notify people"
6. Click "Share"

### 2. "Invalid Credentials" Error

**Symptoms:**

- Error: `Invalid Credentials`
- Authentication fails immediately

**Solutions:**

#### A. Regenerate Service Account Key

1. Go to Google Cloud Console > Credentials
2. Click on your service account
3. Go to "Keys" tab
4. Delete existing keys
5. Click "Add Key" > "Create new key"
6. Choose "JSON" format
7. Download and replace the file

#### B. Check File Format

1. Ensure the JSON file is valid
2. Check that all required fields are present
3. Verify the private key format is correct

### 3. "Access Denied" Error

**Symptoms:**

- Error: `Access denied` or `403 Forbidden`
- Authentication works but spreadsheet access fails

**Solutions:**

#### A. Check Spreadsheet Sharing

1. Open your Google Sheets
2. Click "Share" button
3. Verify the service account email is listed
4. Ensure it has "Editor" permissions

#### B. Check Spreadsheet ID

1. Verify the spreadsheet ID is correct
2. Make sure you're using the right spreadsheet
3. Check that the spreadsheet exists and is accessible

### 4. "API Not Enabled" Error

**Symptoms:**

- Error: `API not enabled`
- Authentication fails with API-related errors

**Solutions:**

#### A. Enable Google Sheets API

1. Go to Google Cloud Console
2. Navigate to "APIs & Services" > "Library"
3. Search for "Google Sheets API"
4. Click "Enable"
5. Wait 5-10 minutes for changes to propagate

#### B. Check Project Selection

1. Make sure you're in the correct project
2. Verify the project ID matches your credentials

## Debug Commands

### Verify Credentials

```bash
npm run verify:credentials
```

This checks:

- File exists and is readable
- JSON format is valid
- All required fields are present
- Private key format is correct

### Debug Authentication

```bash
npm run debug:auth
```

This tests:

- Credentials loading
- JWT client creation
- Access token generation
- Google Sheets API initialization
- Spreadsheet access

### Test Integration

```bash
npm run test:sheets
```

This performs:

- Full authentication test
- Spreadsheet access test
- Data writing test

## Expected Output

### Successful Verification

```
🔍 Verifying Google Sheets credentials...
📁 Checking file path: /path/to/credentials.json
✅ Credentials file found
✅ Credentials file is valid
📧 Service account email: sheet-access@my-sheets-app-467604.iam.gserviceaccount.com
🏢 Project ID: my-sheets-app-467604
🔑 Private key ID: 764e3b37e3b1c9c103a3ae9b6cf7f974a2afded5
📝 Type: service_account
✅ Private key format looks correct
🎉 Credentials verification completed successfully!
```

### Successful Debug

```
🔍 Debugging Google Sheets authentication...
📁 Step 1: Loading credentials...
✅ Credentials loaded
🔑 Step 2: Checking private key...
✅ Private key processed
🔐 Step 3: Creating JWT client...
✅ JWT client created
🔑 Step 4: Testing authentication...
✅ Access token obtained
📊 Step 5: Initializing Google Sheets API...
✅ Google Sheets API initialized
📋 Step 6: Testing spreadsheet access...
✅ Spreadsheet access successful
🎉 All authentication steps completed successfully!
```

### Successful Test

```
📁 Loading credentials from: /path/to/credentials.json
✅ Credentials loaded successfully
📧 Service account email: sheet-access@my-sheets-app-467604.iam.gserviceaccount.com
🔐 JWT client created successfully
📊 Google Sheets API initialized successfully
🔐 Testing Google Sheets authentication...
✅ Access token obtained successfully
✅ Spreadsheet access confirmed: 1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA
✅ Data written successfully to Google Sheets
🎉 Google Sheets integration is working!
```

## Still Having Issues?

If you're still experiencing problems:

1. **Check the logs** in `bookings.log` and `errors.log`
2. **Verify Google Cloud Console** setup
3. **Regenerate service account key** if needed
4. **Check network connectivity** and firewall settings
5. **Ensure Node.js version** is 18.x or higher

## Contact Support

If none of the above solutions work, please provide:

1. The exact error message
2. Output from `npm run debug:auth`
3. Your Google Cloud Console project ID
4. The spreadsheet ID you're trying to access
