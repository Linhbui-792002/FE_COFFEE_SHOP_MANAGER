import Menu from '@src/components/menu'
import React from 'react'
import Head from 'next/head'

const MenuPage = () => {
  return (<>
   <Head>
        <title>CMS-Coffee Menu</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <Menu />
  </>)
}

export default MenuPage
