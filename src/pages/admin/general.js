import General from '@src/components/general'
import React from 'react'
import Head from 'next/head'

const GeneralPage = () => {
  return (<>
  <Head>
        <title>CMS-Coffee General</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <General />
  </>)
}

export default GeneralPage
