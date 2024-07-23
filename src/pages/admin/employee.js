import Employee from '@src/components/employee'
import React from 'react'
import Head from 'next/head'

const EmployeePage = () => {
  return (
    <>
      <Head>
        <title>CMS-Coffee Employee</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
      <Employee />
    </>
  )
}

export default EmployeePage
