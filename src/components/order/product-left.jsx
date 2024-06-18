import React, { useEffect, useRef, useState } from 'react'
import { Tabs, Input } from 'antd'
import ProductList from './product-list'
import ProductCard from './product-item'
import { useSearchProductByEmployeeQuery } from '@src/redux/endPoint/product'
import { useDebounce } from '@src/hooks'

const initialItems = [
  {
    label: 'Thực đơn',
    children: <ProductList />,
    key: '1',
    closable: false
  }
]

const ProductLeft = ({ className }) => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const [openModalSearch, setOpenModalSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debounce = useDebounce(searchTerm, 300)
  const { data, isLoading } = useSearchProductByEmployeeQuery(debounce, { skip: !searchTerm })

  const searchInputRef = useRef(null)

  const onSearchChange = e => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const onChange = newActiveKey => {
    setActiveKey(newActiveKey)
  }

  const handleCancel = () => {
    setOpenModalSearch(false)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchInputRef.current && !searchInputRef.current.input.contains(event.target)) {
        handleCancel()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchInputRef])

  return (
    <div className={className + ' flex space-x-4'}>
      <Tabs
        className="!w-full flex-grow"
        type="card"
        onChange={onChange}
        activeKey={activeKey}
        items={items}
        hideAdd
        tabBarStyle={{ paddingRight: '0' }}
        tabBarGutter={0}
        tabBarExtraContent={
          <div className="flex flex-col relative">
            <Input
              placeholder="Enter to search..."
              style={{ width: '500px', height: 33 }}
              onChange={onSearchChange}
              size="middle"
              allowClear
              ref={searchInputRef}
            />
            <div
              className="p-3 bg-white rounded-md max-h-400px mt-1 absolute w-full top-10 z-50"
              hidden={!openModalSearch && !searchTerm}
            >
              <div className="flex flex-col gap-1 flex-wrap">
                {data &&
                  data?.map(product => <ProductCard key={product._id} product={product} loading={isLoading} isList />)}
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default ProductLeft
