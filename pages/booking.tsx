import Head from 'next/head'
import BookingPage from '../src/pages/BookingPage'

export default function Booking() {
  return (
    <>
      <Head>
        <title>Book Your Trip - Ethiopian Coffee Origin Trip</title>
        <meta
          name='description'
          content='Book your authentic Ethiopian coffee experience. Choose from our carefully curated tours and start your coffee adventure.'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <BookingPage />
    </>
  )
}
