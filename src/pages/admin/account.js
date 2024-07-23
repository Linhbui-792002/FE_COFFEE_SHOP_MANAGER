import React from 'react'
import Account from '../../components/account/index'
import Head from 'next/head'

const AccountPage = () => {
  return (
    <>
      <Head>
        <title>CMS-Coffee - Account</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
      <Account />
    </>
  )
}

export default AccountPage
