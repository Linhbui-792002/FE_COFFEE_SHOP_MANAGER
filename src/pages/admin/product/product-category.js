import ProductCategory from '@src/components/productCategory'
import React from 'react'
import Head from 'next/head'

const ProductCategoryPage = () => {
  return (<>
 <Head>
        <title>CMS-Coffee Product Category</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <ProductCategory />
  </>
  )
}

export default ProductCategoryPage
