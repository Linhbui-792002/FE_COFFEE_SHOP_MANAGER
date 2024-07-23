import Login from '@src/components/login'
import React from 'react'
import Head from "next/head";

const LoginPage = () => {
  return( <>
     <Head>
        <title>CMS-Coffee Login</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
      <Login />
  </> 
  )
}

export default LoginPage
