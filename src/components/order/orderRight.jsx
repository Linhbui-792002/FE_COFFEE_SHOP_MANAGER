import React, { useState } from 'react'
import { Tabs } from 'antd'
import OrderList from './orderList'

const OrderRight = ({ className }) => {
  const initialItems = [
    {
      label: '1-1',
      children: <OrderList />,
      key: '1-1'
    }
  ]

  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const [prefix, setPrefix] = useState(1)
  const [count, setCount] = useState(2) // Start with 2 since the initial tab is 1

  const onChange = newActiveKey => {
    setActiveKey(newActiveKey)
  }

  const add = () => {
    let newPrefix = prefix
    let newCount = count

    // Check if we need to reset count and increment prefix
    if (newCount > 20) {
      newPrefix += 1
      newCount = 1
    }

    const newActiveKey = `${newPrefix}-${newCount}`
    const newPanes = [...items]
    newPanes.push({
      label: newActiveKey,
      children: <OrderList />,
      key: newActiveKey
    })
    setItems(newPanes)
    setActiveKey(newActiveKey)

    // Update the count for next tab
    setPrefix(newPrefix)
    setCount(newCount + 1)
  }

  const remove = targetKey => {
    let newActiveKey = activeKey
    let lastIndex = -1
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = items.filter(item => item.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setItems(newPanes)
    setActiveKey(newActiveKey)
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
