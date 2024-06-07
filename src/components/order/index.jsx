import React from 'react'
import ProductLeft from './productLeft'
import OrderRight from './orderRight'

const Order = () => {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <ProductLeft className={'col-span-7 bg-white p-5 rounded-md'} />
      <OrderRight className={'col-span-5 bg-white p-5 rounded-md'} />
    </div>
  )
}

export default Order
