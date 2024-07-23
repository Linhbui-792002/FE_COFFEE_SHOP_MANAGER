import Voucher from '@src/components/voucher'
import React from 'react'
import Head from 'next/head'

const VoucherPage = () => {
  return (<>
    <Head>
        <title>CMS-Coffee Voucher</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
      </Head>
  <Voucher />
  </>)
}

export default VoucherPage
