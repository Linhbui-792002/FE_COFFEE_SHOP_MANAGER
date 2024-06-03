import React, { useRef, useState } from 'react'
import { Tabs, Input, Switch, Card, Avatar, Skeleton } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
const { Search } = Input
const { Meta } = Card

const MOCK_PRODUCT = [
  {
    id: 1,
    name: 'Cà phê đen',
    price: 15000,
    image: 'https://via.placeholder.com/150',
    description: 'Cà phê đen'
  },
  {
    id: 2,
    name: 'Cà phê sữa',
    price: 20000,
    image: 'https://via.placeholder.com/150',
    description: 'Cà phê sữa'
  },
  {
    id: 3,
    name: 'Cà phê đá',
    price: 20000,
    image: 'https://via.placeholder.com/150',
    description: 'Cà phê đá'
  }
]

const ProductCard = ({ product, loading }) => (
  <Card
    hoverable
    cover={<img alt={product.name} src={product.image} className="h-[25%] object-cover" />}
    className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
    loading={loading}
    style={{ width: 240, height: 350 }}
  >
    <Skeleton loading={loading} avatar active>
      <Meta title={product.name} description={product.description} />
      <div className="mt-2 text-lg font-semibold text-blue-600">{product.price.toLocaleString()} VND</div>
    </Skeleton>
  </Card>
)

const ProductList = () => {
  const [loading, setLoading] = useState(true)

  const onChange = checked => {
    setLoading(!checked)
  }

  return (
    <>
      <div className="mb-4">
        <Switch checked={!loading} onChange={onChange} />
        <span className="ml-2">Toggle Loading</span>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {MOCK_PRODUCT.map(product => (
          <ProductCard key={product.id} product={product} loading={loading} />
        ))}
      </div>
    </>
  )
}
const ProductLeft = () => {
  const initialItems = [
    {
      label: 'Phòng bàn',
      children: <ProductList />,
      key: '1',
      closable: false
    },
    {
      label: 'Thực đơn',
      children: 'Content of Tab 2',
      key: '2',
      closable: false
    }
  ]

  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const newTabIndex = useRef(0)
  const onChange = newActiveKey => {
    setActiveKey(newActiveKey)
  }

  const onSearch = value => {
    console.log(value)
  }

  return (
    <div className="flex w-[50%] space-x-4">
      <Tabs className="w-50" type="editable-card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
    </div>
  )
}

export default ProductLeft
