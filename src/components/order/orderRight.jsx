import React, { useEffect, useMemo, useState } from 'react'
import { Tabs } from 'antd'
import OrderList from './orderList'
import { useDispatch, useSelector } from 'react-redux'
import { addOrder, removeOrder, setKeyOrderActive } from '@src/redux/slices/orderSlice'

const OrderRight = ({ className }) => {
  const initialItems = useSelector(state => state.order.listOrder)
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()
  const keyOrderActive = useSelector(state => state.order.keyOrderActive)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (initialItems.length !== 0) {
      let order = initialItems.find(order => order.key === keyOrderActive)
      order = { ...order, children: <OrderList /> }
      const listOrder = initialItems.filter(item => item.key !== order.key)
      const index = initialItems.findIndex(item => item?.key == order.key)
      listOrder.splice(index, 0, order)
      setItems([...listOrder])
    } else {
      setItems([])
    }
  }, [keyOrderActive, initialItems])

  const onChange = newActiveKey => {
    dispatch(setKeyOrderActive(newActiveKey))
  }

  const add = () => {
    const newKey = initialItems.length == 0 ? 1 : initialItems[initialItems.length - 1]?.key + 1

    const newActiveKey = `Order-${newKey}`
    dispatch(
      addOrder({
        key: newKey,
        label: newActiveKey,
        children: null,
        orderDetail: []
      })
    )
  }

  const remove = targetKey => {
    dispatch(removeOrder(targetKey))
  }

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add()
    } else {
      remove(targetKey)
    }
  }

  return (
    <div className={className + ' flex space-x-4'}>
      <Tabs
        className="w-full"
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  )
}

export default OrderRight
