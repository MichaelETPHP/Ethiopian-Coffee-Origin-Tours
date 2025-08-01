# Google Sheets Integration Setup

This guide explains how to set up Google Sheets integration for the Ethiopian Coffee Tours booking system.

## Prerequisites

1. Google Cloud Console account
2. Google Sheets API enabled
3. Service account with proper permissions

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `sheet-access`
   - Description: `Service account for Google Sheets integration`
4. Click "Create and Continue"
5. Skip role assignment (we'll handle permissions in Google Sheets)
6. Click "Done"

### 3. Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file
6. Rename it to `my-sheets-app-467604-764e3b37e3b1.json`
7. Place it in the project root directory

### 4. Google Sheets Setup

1. Create a new Google Sheets document
2. Note the Spreadsheet ID from the URL:

   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Current ID: `1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA`

3. Share the spreadsheet with the service account:
   - Click "Share" button
   - Add email: `sheet-access@my-sheets-app-467604.iam.gserviceaccount.com`
   - Give "Editor" permissions
   - Uncheck "Notify people"
   - Click "Share"

### 5. Configure the Application

The application is already configured with:

- Spreadsheet ID: `1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA`
- Range: `Sheet1!A:Z`
- Service account credentials: `my-sheets-app-467604-764e3b37e3b1.json`

## Testing the Integration

### Step 1: Verify Credentials

First, verify that your credentials file is valid:

```bash
npm run verify:credentials
```

This will check:

- File exists in the correct location
- JSON format is valid
- All required fields are present
- Private key format is correct

### Step 2: Test Google Sheets Integration

```bash
npm run test:sheets
```

This will:

1. Test authentication
2. Verify spreadsheet access
3. Write a test entry to the spreadsheet

### Expected Output

```
🔐 Testing Google Sheets authentication...
✅ Authentication successful
✅ Spreadsheet access confirmed: 1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA
✅ Data written successfully to Google Sheets
🎉 Google Sheets integration is working!
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Verify the service account JSON file is in the project root
   - Check that the file name matches the code
   - Ensure the JSON file is valid

2. **Spreadsheet Access Denied**

   - Make sure the spreadsheet is shared with the service account email
   - Verify the service account has "Editor" permissions
   - Check that the Spreadsheet ID is correct

3. **API Not Enabled**
   - Go to Google Cloud Console
   - Enable the Google Sheets API
   - Wait a few minutes for changes to propagate

### Error Logs

The application logs errors to:

- `bookings.log` - Failed booking attempts
- `errors.log` - Server errors

## Data Format

Bookings are stored in Google Sheets with the following columns:

| Column | Data             |
| ------ | ---------------- |
| A      | Timestamp        |
| B      | Full Name        |
| C      | Email            |
| D      | Phone            |
| E      | Age              |
| F      | Country          |
| G      | Booking Type     |
| H      | Number of People |
| I      | Selected Package |
| J      | Source           |

## Development vs Production

- **Development**: Uses local server with Google Sheets integration
- **Production**: Uses Vercel serverless functions with Google Sheets integration

Both environments use the same Google Sheets setup.
