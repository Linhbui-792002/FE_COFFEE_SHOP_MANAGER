import Salary from '@src/components/salary'
import Head from 'next/head'
import React from 'react'
import Head from 'next/head'

const SalaryPage = () => {
  return (<>
    <Head>
        <title>CMS-Coffee Salary</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <Salary />
  </>
  )
}

export default SalaryPage
