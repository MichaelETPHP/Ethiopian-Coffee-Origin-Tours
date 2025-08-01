// test-data.js - Sample booking data for testing
export const testBookings = {
  // Basic booking
  basic: {
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    age: '35',
    country: 'US',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: 'southern-ethiopia',
  },

  // Group booking
  group: {
    fullName: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1555123456',
    age: '28',
    country: 'ES',
    bookingType: 'group',
    numberOfPeople: '6',
    selectedPackage: 'complete-ethiopia',
  },

  // Family booking
  family: {
    fullName: 'David Johnson',
    email: 'david.johnson@example.com',
    phone: '+44123456789',
    age: '42',
    country: 'GB',
    bookingType: 'family',
    numberOfPeople: '4',
    selectedPackage: 'northern-ethiopia',
  },

  // International booking
  international: {
    fullName: 'Yuki Tanaka',
    email: 'yuki.tanaka@example.com',
    phone: '+81901234567',
    age: '31',
    country: 'JP',
    bookingType: 'individual',
    numberOfPeople: '2',
    selectedPackage: 'southern-ethiopia',
  },

  // Ethiopian local booking
  ethiopian: {
    fullName: 'Abebe Kebede',
    email: 'abebe.kebede@example.com',
    phone: '+251911234567',
    age: '25',
    country: 'ET',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: 'northern-ethiopia',
  },

  // Senior booking
  senior: {
    fullName: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '+16175551234',
    age: '68',
    country: 'CA',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: 'southern-ethiopia',
  },

  // Large group booking
  largeGroup: {
    fullName: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+61412345678',
    age: '29',
    country: 'AU',
    bookingType: 'group',
    numberOfPeople: '12',
    selectedPackage: 'complete-ethiopia',
  },

  // Minimal data (for validation testing)
  minimal: {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
  },

  // Invalid data (for error testing)
  invalid: {
    fullName: '',
    email: 'invalid-email',
    phone: '',
  },
}

// Test scenarios
export const testScenarios = {
  // Valid bookings
  validBookings: [
    testBookings.basic,
    testBookings.group,
    testBookings.family,
    testBookings.international,
    testBookings.ethiopian,
    testBookings.senior,
    testBookings.largeGroup,
  ],

  // Edge cases
  edgeCases: [
    {
      ...testBookings.basic,
      fullName: 'Dr. John Smith Jr. III',
      email: 'john.smith+test@example.com',
    },
    {
      ...testBookings.basic,
      phone: '+1 (555) 123-4567 ext. 123',
    },
    {
      ...testBookings.basic,
      age: '18',
    },
    {
      ...testBookings.basic,
      age: '75',
    },
  ],

  // Invalid data for testing validation
  invalidData: [
    testBookings.invalid,
    {
      fullName: 'John',
      email: 'not-an-email',
      phone: '123',
    },
    {
      fullName: 'A'.repeat(100), // Very long name
      email: 'test@example.com',
      phone: '1234567890',
    },
  ],
}

// Function to get random test booking
export function getRandomBooking() {
  const validBookings = testScenarios.validBookings
  return validBookings[Math.floor(Math.random() * validBookings.length)]
}

// Function to generate test booking with custom data
export function generateTestBooking(customData = {}) {
  return {
    ...testBookings.basic,
    ...customData,
  }
}

console.log('📋 Test data loaded successfully!')
console.log('Available test bookings:', Object.keys(testBookings))
console.log('Use getRandomBooking() for random test data')
console.log('Use generateTestBooking(customData) for custom test data')
