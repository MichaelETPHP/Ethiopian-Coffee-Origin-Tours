# Curl Test Commands

## Quick Test Commands

### 1. Health Check

```bash
curl -X GET http://localhost:4040/api/health
```

### 2. Basic Individual Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "age": "35",
    "country": "US",
    "bookingType": "individual",
    "numberOfPeople": "1",
    "selectedPackage": "southern-ethiopia"
  }'
```

### 3. Group Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Maria Garcia",
    "email": "maria.garcia@example.com",
    "phone": "+1555123456",
    "age": "28",
    "country": "ES",
    "bookingType": "group",
    "numberOfPeople": "6",
    "selectedPackage": "complete-ethiopia"
  }'
```

### 4. Family Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Johnson",
    "email": "david.johnson@example.com",
    "phone": "+44123456789",
    "age": "42",
    "country": "GB",
    "bookingType": "family",
    "numberOfPeople": "4",
    "selectedPackage": "northern-ethiopia"
  }'
```

### 5. International Booking (Japan)

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Yuki Tanaka",
    "email": "yuki.tanaka@example.com",
    "phone": "+81901234567",
    "age": "31",
    "country": "JP",
    "bookingType": "individual",
    "numberOfPeople": "2",
    "selectedPackage": "southern-ethiopia"
  }'
```

### 6. Ethiopian Local Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Abebe Kebede",
    "email": "abebe.kebede@example.com",
    "phone": "+251911234567",
    "age": "25",
    "country": "ET",
    "bookingType": "individual",
    "numberOfPeople": "1",
    "selectedPackage": "northern-ethiopia"
  }'
```

### 7. Senior Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Robert Wilson",
    "email": "robert.wilson@example.com",
    "phone": "+16175551234",
    "age": "68",
    "country": "CA",
    "bookingType": "individual",
    "numberOfPeople": "1",
    "selectedPackage": "southern-ethiopia"
  }'
```

### 8. Large Group Booking

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sarah Chen",
    "email": "sarah.chen@example.com",
    "phone": "+61412345678",
    "age": "29",
    "country": "AU",
    "bookingType": "group",
    "numberOfPeople": "12",
    "selectedPackage": "complete-ethiopia"
  }'
```

### 9. Simple API Test (No Google Sheets)

```bash
curl -X POST http://localhost:4040/api/booking-simple \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "age": "25",
    "country": "US",
    "bookingType": "individual",
    "numberOfPeople": "1",
    "selectedPackage": "southern-ethiopia"
  }'
```

## PowerShell Commands (Windows)

### Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:4040/api/health" -Method GET
```

### Basic Booking

```powershell
Invoke-WebRequest -Uri "http://localhost:4040/api/sheets-booking" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"fullName":"John Smith","email":"john.smith@example.com","phone":"+1234567890","age":"35","country":"US","bookingType":"individual","numberOfPeople":"1","selectedPackage":"southern-ethiopia"}'
```

## Vercel Production Testing

Replace `localhost:4040` with your Vercel URL:

```bash
# Example for Vercel deployment
curl -X POST https://your-app.vercel.app/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "age": "35",
    "country": "US",
    "bookingType": "individual",
    "numberOfPeople": "1",
    "selectedPackage": "southern-ethiopia"
  }'
```

## Validation Testing

### Invalid Data Test

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "",
    "email": "invalid-email",
    "phone": ""
  }'
```

### Missing Required Fields

```bash
curl -X POST http://localhost:4040/api/sheets-booking \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith"
  }'
```

## Expected Responses

### Success Response

```json
{
  "success": true,
  "message": "Booking submitted successfully to Google Sheets",
  "data": {
    "bookingId": 1234567890,
    "timestamp": "2025-08-01T20:00:00.000Z",
    "bookingData": { ... },
    "sheetsSuccess": true,
    "sheetsResponse": { ... }
  }
}
```

### Error Response

```json
{
  "error": "Validation failed",
  "message": "Full name, email, and phone are required"
}
```
