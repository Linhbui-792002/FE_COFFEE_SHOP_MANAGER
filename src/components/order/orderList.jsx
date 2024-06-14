import React, { useMemo, useState } from 'react'
import { Divider, Input, InputNumber } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrder, removeOrderDetailInOrder } from '@src/redux/slices/orderSlice'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const initialOrderItems = useSelector(state => state.order.orderDetail)
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()

  console.log(initialOrderItems, 'initialOrderItems');
  const orderDetail = useMemo(() => {
    const order = initialOrderItems?.listOrder
    return order ?? []
  }, [initialOrderItems, activeKey])

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
    if (!value || value < 1) {
      value = 1;
    }
    dispatch(updateOrder({ key: activeKey, status: 'change', orderDetail: { id: orderId }, quantity: value }))
  };
  return (
    <div className="flex flex-col gap-2">
      {orderDetail &&
        orderDetail.map(order => (
          <div key={order.id} className="px-2 bg-white w-full rounded-md">
            <div className="w-full flex space-between gap-4 items-center">
              <div className="min-w-[40%] max-w-[40%] flex items-center gap-2 font-bold">
                <DeleteOutlined
                  className="w-[2rem] h-[2rem] text-lg p-2 border-[1px] border-b-red rounded-full cursor-pointer"
                  onClick={() => handleDelete(order?.id)}
                />
                {order?.name}
              </div>
              <div className="w-full font-medium">
                <InputNumber
                  addonBefore={<MinusCircleOutlined
                    onClick={() => handleDecrease(order?.id)}
                    className="cursor-pointer"
                  />}
                  addonAfter={
                    <PlusCircleOutlined
                      onClick={() => handleIncrease(order?.id)}
                      className="cursor-pointer"
                    />
                  }
                  controls={false}
                  onChange={(value) => onChangeQuantity(value, order?.id)}
                  min={1}
                  max={50}
                  value={order?.quantity}
                  className="w-full text-center"
                />
              </div>
              <div className="w-full flex gap-2 items-end">
                <div className="underline whitespace-nowrap">{order?.price?.toLocaleString()} VND</div>
                <div className='whitespace-nowrap'>
                  {(order.price * order.quantity).toLocaleString()} VND
                </div>
              </div>
            </div>
            <Divider className="!py-1 !my-1" />
          </div>

        ))}
    </div>
  )
}

export default OrderList
