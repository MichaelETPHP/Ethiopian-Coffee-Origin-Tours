import Head from 'next/head'
import HomePage from '../src/pages/HomePage'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethiopian Coffee Origin Trip</title>
        <meta
          name='description'
          content="Discover authentic Ethiopian coffee experiences and the stories behind every cup in Ethiopia's legendary coffee regions."
        />
        <meta
          name='keywords'
          content='Ethiopian coffee, coffee tours, coffee origin, Ethiopia travel, coffee experience'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <HomePage />
    </>
  )
}
