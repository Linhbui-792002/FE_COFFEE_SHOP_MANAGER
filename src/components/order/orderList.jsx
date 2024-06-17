import React, { useEffect, useMemo, useState } from 'react'
import { Button, Divider, InputNumber, Modal } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrder, removeOrderDetailInOrder } from '@src/redux/slices/orderSlice'
import OrderPayment from './OrderPayment' // Đường dẫn phụ thuộc vào cấu trúc thư mục của bạn

const OrderList = () => {
  const [totalOrder, setTotalOrder] = useState(0)
  const [totalQuantityOrder, setTotalQuantityOrder] = useState(0)
  const [paymentVisible, setPaymentVisible] = useState(false) // State để điều khiển hiển thị modal thanh toán

  const initialOrderItems = useSelector(state => state.order.orderDetail)
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()

  const orderDetail = useMemo(() => initialOrderItems?.listOrder ?? [], [initialOrderItems, activeKey])

  const handleIncrease = orderId => {
    dispatch(updateOrder({ key: activeKey, status: 'up', orderDetail: { id: orderId } }))
  }

  const handleDecrease = orderId => {
    dispatch(updateOrder({ key: activeKey, status: 'down', orderDetail: { id: orderId } }))
  }

  const handleDelete = orderId => {
    dispatch(removeOrderDetailInOrder({ key: activeKey, id: orderId }))
  }

  const onChangeQuantity = (value, orderId) => {
    const newValue = value || 1
    dispatch(updateOrder({ key: activeKey, status: 'change', orderDetail: { id: orderId }, quantity: newValue }))
  }

  const handleOpenPaymentModal = () => {
    setPaymentVisible(true)
  }

  const handleClosePaymentModal = () => {
    setPaymentVisible(false)
  }

  useEffect(() => {
    const total = orderDetail.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    const quantity = orderDetail.reduce((acc, cur) => acc + cur.quantity, 0)
    setTotalQuantityOrder(quantity)
    setTotalOrder(total)
  }, [orderDetail])

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2 flex-grow">
        {orderDetail.map(order => (
          <div key={order.id} className="px-2 bg-white w-full rounded-md">
            <div className="w-full flex justify-between gap-4 items-center">
              <div className="min-w-[40%] max-w-[40%] flex items-center gap-2 font-bold">
                <DeleteOutlined
                  className="w-[2rem] h-[2rem] text-lg p-2 border-[1px] border-b-red rounded-full cursor-pointer"
                  onClick={() => handleDelete(order?.id)}
                />
                {order?.name}
              </div>
              <div className="w-full font-medium">
                <InputNumber
                  addonBefore={
                    <MinusCircleOutlined onClick={() => handleDecrease(order?.id)} className="cursor-pointer" />
                  }
                  addonAfter={
                    <PlusCircleOutlined onClick={() => handleIncrease(order?.id)} className="cursor-pointer" />
                  }
                  controls={false}
                  onChange={value => onChangeQuantity(value, order?.id)}
                  min={1}
                  max={50}
                  value={order?.quantity}
                  className="w-[9rem] text-center"
                />
              </div>
              <div className="w-full flex gap-2 justify-around">
                <div className="underline whitespace-nowrap">{order?.price?.toLocaleString()} </div>
                <div className="whitespace-nowrap">{(order.price * order.quantity).toLocaleString()} </div>
              </div>
            </div>
            <Divider className="!py-1 !my-1" />
          </div>
        ))}
      </div>
      <div className="w-full flex mt-4 justify-end items-center">
        <div className="flex items-center gap-2">
          <Button type="primary" className="w-[300px]" onClick={handleOpenPaymentModal}>
            Thanh toán
          </Button>
          <Modal
            title="Thanh toán đơn hàng"
            visible={paymentVisible}
            onCancel={handleClosePaymentModal}
            footer={null}
            centered
          >
            <OrderPayment orderDetail={orderDetail} onClose={handleClosePaymentModal} />
          </Modal>
        </div>
        <div className="ml-auto flex gap-2 items-end">
          <div className="font-bold">
            Tổng tiền
            <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
              {totalQuantityOrder}
            </span>
          </div>
          <div className="font-bold">{totalOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </div>
        </div>
      </div>
    </div>
  )
}

export default OrderList
