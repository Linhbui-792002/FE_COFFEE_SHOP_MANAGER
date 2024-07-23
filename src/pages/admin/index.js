import DashBoard from '@src/components/dashboard/dashboard'
import Head from 'next/head'
import React from 'react'

const AdminPage = () => {
  return (<>
   <Head>
        <title>CMS-Coffee Admin</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <DashBoard />
  </>
  )
}

export default AdminPage
