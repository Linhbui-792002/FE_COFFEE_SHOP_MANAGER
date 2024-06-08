import React, { useMemo, useState } from 'react'
import { Input } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const initialItems = useSelector(state => state.order.listOrder)
  const activeKey = useSelector(state => state.order.keyOrderActive)

  const orderDetail = useMemo(() => {
    const order = initialItems.find(order => order.key === activeKey)
    return order?.orderDetail ?? []
  }, [initialItems, activeKey])

  console.log('orderDetail', orderDetail)
  const handleIncrease = orderId => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === orderId ? { ...order, quantity: order.quantity + 1 } : order))
    )
  }

  const handleDecrease = orderId => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.quantity > 1 ? { ...order, quantity: order.quantity - 1 } : order
      )
    )
  }

  const handleDelete = orderId => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
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
