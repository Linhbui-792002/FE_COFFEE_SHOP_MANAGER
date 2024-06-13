import React, { useMemo, useState } from 'react'
import { Input } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrder, removeOrderDetailInOrder } from '@src/redux/slices/orderSlice'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const initialOrderItems = useSelector(state => state.order.orderDetail)
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()

  const orderDetail = useMemo(() => {
    const order = initialOrderItems?.listOrder
    return order ?? []
  }, [initialOrderItems, activeKey])

  console.log(orderDetail, 'orderDetail')
  const handleIncrease = orderId => {
    console.log(orderId, 'orderId')
    dispatch(updateOrder({ key: activeKey, status: 'up', orderDetail: { id: orderId } }))
  }

  const handleDecrease = orderId => {
    dispatch(updateOrder({ key: activeKey, status: 'down', orderDetail: { id: orderId } }))
  }

  const handleDelete = orderId => {
    dispatch(removeOrderDetailInOrder({ key: activeKey, id: orderId }))
  }

  const handleNoteChange = (orderId, newNote) => {
    setOrders(prevOrders => prevOrders.map(order => (order.id === orderId ? { ...order, note: newNote } : order)))
  }

  return (
    <div className="flex flex-col gap-2">
      {orderDetail &&
        orderDetail.map(order => (
          <div key={order.id} className="p-2 bg-white w-full rounded-md flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <div className="font-bold flex gap-2">
                <DeleteOutlined
                  className="p-1 bg-slate-200 rounded-full cursor-pointer"
                  onClick={() => handleDelete(order?.id)}
                />
                {order?.name}
              </div>
              <div className="flex flex-row gap-10">
                <div className="font-medium flex flex-row gap-2 items-center">
                  <MinusCircleOutlined
                    style={{ fontSize: '20px', color: '#808080' }}
                    onClick={() => handleDecrease(order?.id)}
                    className="cursor-pointer"
                  />
                  <div>{order?.quantity}</div>
                  <PlusCircleOutlined
                    style={{ fontSize: '20px', color: '#808080' }}
                    onClick={() => handleIncrease(order?.id)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="w-full underline">{order?.price?.toLocaleString()} VND</div>
                <div
                  style={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  {(order.price * order.quantity).toLocaleString()} VND
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center w-44">
              <Input
                placeholder="Nhập ghi chú"
                prefix={<SnippetsOutlined />}
                style={{
                  border: 'none',
                  outline: 'none',
                  paddingLeft: 0
                }}
                value={order.note}
                onChange={e => handleNoteChange(order.id, e.target.value)}
              />
            </div>
          </div>
        ))}
    </div>
  )
}

export default OrderList
