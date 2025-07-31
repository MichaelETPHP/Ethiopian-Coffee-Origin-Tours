// src/lib/api-utils.ts - API utility functions

// Get the base API URL for the current environment
export function getApiBaseUrl(): string {
  // In development, use relative URL (will be proxied by Vite)
  if (process.env.NODE_ENV === 'development') {
    return '/api'
  }

  // In production (Vercel), use relative URL (will be handled by Vercel)
  return '/api'
}

// Make API requests with proper error handling
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response
    } else {
      // If not JSON, throw an error with the text content
      const text = await response.text()
      throw new Error(`Server returned non-JSON response: ${text}`)
    }
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Submit booking with proper error handling
export async function submitBooking(bookingData: any): Promise<any> {
  try {
    const response = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to submit booking')
    }

    return await response.json()
  } catch (error) {
    console.error('Booking submission error:', error)
    throw error
  }
}
