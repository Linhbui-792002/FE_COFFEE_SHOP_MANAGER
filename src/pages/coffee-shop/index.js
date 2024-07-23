import React from 'react'
import ProductLeft from '../../components/order/product-left'
import OrderRight from '../../components/order/order-right'
import Order from '@src/components/order'
import Head from 'next/head'

const OrderPage = () => {
  return (<>
  <Head>
        <title>CMS-Coffee</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
      <Order />
  </>)
}

export default OrderPage
