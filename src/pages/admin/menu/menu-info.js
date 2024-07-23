import MenuInfo from '@src/components/menuInfo'
import React from 'react'
import Head from 'next/head'

const MenuInfoPage = () => {
  return (
    <>
   <Head>
        <title>CMS-Coffee Menu Info</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
      <MenuInfo />
    </>
  )
}

export default MenuInfoPage
