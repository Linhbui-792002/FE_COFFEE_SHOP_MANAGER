import React, { useState } from 'react'
import { Button, Divider, InputNumber, Spin } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrder, removeOrderDetailInOrder } from '@src/redux/slices/orderSlice'
import OrderPaymentModal from './order-payment'
import { currencyFormatter } from '@src/utils'

const OrderItem = () => {
  const orderDetails = useSelector(state => state.order.orderDetail?.listOrder ?? [])
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const updateOrderQuantity = (orderId, action, quantity = 1) => {
    dispatch(updateOrder({ key: activeKey, status: action, orderDetail: { id: orderId }, quantity }))
  }

  const handleDelete = orderId => {
    dispatch(removeOrderDetailInOrder({ key: activeKey, id: orderId }))
  }

  const handleOpenPaymentModal = () => {
    setIsModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2 flex-grow">
        {orderDetails.map(order => (
          <div key={order.id} className="px-2 bg-white w-full rounded-md">
            <div className="w-full flex justify-between gap-4 items-center">
              <div className="min-w-[40%] max-w-[40%] flex items-center gap-2 font-bold">
                <DeleteOutlined
                  className="w-[2rem] h-[2rem] text-lg p-2 border border-red-400 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600 transition duration-300 ease-in-out"
                  onClick={() => handleDelete(order.id)}
                />
                {order.name}
              </div>
              <div className="w-full font-medium mb-2">
                <InputNumber
                  addonBefore={
                    <MinusCircleOutlined
                      onClick={() => updateOrderQuantity(order.id, 'down')}
                      className="cursor-pointer"
                    />
                  }
                  addonAfter={
                    <PlusCircleOutlined
                      onClick={() => updateOrderQuantity(order.id, 'up')}
                      className="cursor-pointer"
                    />
                  }
                  controls={false}
                  onChange={value => updateOrderQuantity(order.id, 'change', value)}
                  min={1}
                  max={50}
                  value={order.quantity}
                  className="w-[9rem] text-center"
                />
              </div>
              <div className="w-full flex gap-2 justify-around font-medium">
                <div className="underline whitespace-nowrap">{order.price.toLocaleString()}</div>
                <div className="whitespace-nowrap">{(order.price * order.quantity).toLocaleString()}</div>
              </div>
            </div>
            <Divider className="!my-1" />
          </div>
        ))}
      </div>
      <div className="w-full flex mt-4 justify-end items-center">
        <Spin spinning={false}>
          <Button
            type="primary"
            onClick={handleOpenPaymentModal}
            className="w-[300px]"
            disabled={orderDetails.length === 0}
          >
            Payment
          </Button>
          <OrderPaymentModal isOpen={isModalOpen} onClose={handleClosePaymentModal} orderDetails={orderDetails} />
        </Spin>
        <div className={`ml-auto gap-2 items-end ${orderDetails.length === 0 ? 'hidden' : 'flex'}`}>
          <div className="font-bold">
            Total
            <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
              {orderDetails.reduce((acc, cur) => acc + cur.quantity, 0)}
            </span>
          </div>
          <div className="font-bold">
            {currencyFormatter(orderDetails.reduce((acc, cur) => acc + cur.price * cur.quantity, 0))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
