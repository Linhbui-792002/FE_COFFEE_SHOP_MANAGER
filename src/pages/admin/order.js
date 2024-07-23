import OrderHistory from '@src/components/orderHistory'
import React from 'react'
import Head from 'next/head'

const Order = () => {
  return (<>
    <Head>
        <title>CMS-Coffee Order</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <OrderHistory />
  </>
  )
}

export default Order
