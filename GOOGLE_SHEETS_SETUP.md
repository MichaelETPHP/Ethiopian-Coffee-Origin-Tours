# Google Sheets Setup Guide

This guide will help you set up Google Sheets as the database for the Ethiopian Coffee Tours booking system.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `ethiopian-coffee-tours`
   - Description: `Service account for booking system`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Download the JSON file

## Step 4: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Ethiopian Coffee Tours Bookings"
4. Copy the spreadsheet ID from the URL:
   - The URL will look like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 5: Share the Spreadsheet

1. In your Google Spreadsheet, click "Share"
2. Add your service account email (from the JSON file) with "Editor" permissions
3. Make sure to uncheck "Notify people" to avoid sending an email

## Step 6: Configure the Application

1. **Place the JSON credentials file** in the `config/` folder:
   ```
   config/my-sheets-app-467604-93cad7db97fd.json
   ```

2. **Copy `sheets.env.example` to `.env`** and configure email settings:
   ```env
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ADMIN_EMAIL=admin@yourdomain.com

   # JWT secret for admin authentication
   JWT_SECRET=your_jwt_secret_here
   ```

3. **The spreadsheet ID is already configured** in the code to use your specific spreadsheet.

## Step 7: Initialize the Spreadsheet

Run the setup script to initialize the spreadsheet with headers:

```bash
node setup-sheets.js
```

This will create headers in your spreadsheet with the following columns:

- ID
- Name
- Email
- Phone
- Age
- Group Size
- Selected Tour Package
- Status
- Created At
- Updated At

## Step 8: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Create a test booking through the website
3. Check your Google Spreadsheet to see if the booking was added

## Troubleshooting

### Common Issues

1. **"Invalid private key" error**

   - Make sure the private key is properly formatted with `\n` characters
   - The key should be wrapped in quotes

2. **"Spreadsheet not found" error**

   - Check that the spreadsheet ID is correct
   - Ensure the service account has access to the spreadsheet

3. **"Permission denied" error**
   - Make sure the service account email has "Editor" permissions on the spreadsheet
   - Check that the Google Sheets API is enabled

### Getting the Private Key

The private key in the JSON file looks like this:

```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
}
```

Copy the entire `private_key` value (including the `\n` characters) to your `.env` file.

## Security Notes

1. Never commit your `.env` file to version control
2. Keep your service account key secure
3. Consider using environment variables in production
4. Regularly rotate your service account keys

## Production Deployment

For production deployment (e.g., Vercel):

1. Add the environment variables to your hosting platform
2. Make sure the service account has access to the production spreadsheet
3. Test the booking system thoroughly before going live

## Benefits of Using Google Sheets

1. **No Database Setup**: No need to set up and maintain a database
2. **Easy Access**: View and edit bookings directly in Google Sheets
3. **Backup**: Google Sheets automatically backs up your data
4. **Collaboration**: Multiple people can view and manage bookings
5. **Export**: Easy to export data to CSV or other formats
6. **Real-time**: Changes are reflected immediately

## Migration from Database

If you're migrating from a database system:

1. Export your existing bookings to CSV
2. Import the CSV into your Google Spreadsheet
3. Make sure the column headers match the expected format
4. Test the system with the imported data

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure the Google Sheets API is enabled
4. Confirm the service account has proper permissions
