import Product from '@src/components/product'
import React from 'react'
import Head from 'next/head'

const ProductPage = () => {
  return (<>
  <Head>
        <title>CMS-Coffee Product</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <Product />
  </>
  )
}

export default ProductPage
