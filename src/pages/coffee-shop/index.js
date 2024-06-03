import React from 'react'
import ProductLeft from './components/productLeft'
import OrderRight from './components/orderRight'

const OrderPage = () => {
  return (
    <div className="flex gap-4 w-[1440px]">
      <ProductLeft />
      <OrderRight />
    </div>
  )
}

export default OrderPage
