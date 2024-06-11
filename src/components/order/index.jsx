import React from 'react'
import ProductLeft from './productLeft'
import OrderRight from './orderRight'

const Order = () => {
  return (
    <div className="grid grid-cols-12 gap-4 w-full min-h-[calc(100vh-(64px+21px+21px))]">
      <ProductLeft className={'col-span-7 bg-white p-5 rounded-md h-full'} />
      <OrderRight className={'col-span-5 bg-white p-5 rounded-md h-full'} />
    </div>
  )
}

export default Order
