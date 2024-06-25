import React, { useEffect, useRef, useState } from 'react'
import { Tabs, Input } from 'antd'
import ProductList from './product-list'
import ProductItem from './product-item'
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

  const containerRef = useRef(null)

  const onSearchChange = e => {
    const value = e.target.value
    setSearchTerm(value)
    setOpenModalSearch(!!value)
  }

  const onChange = newActiveKey => {
    setActiveKey(newActiveKey)
  }

  const handleCancel = () => {
    setSearchTerm('')
    setOpenModalSearch(false)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleCancel()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`${className} flex space-x-4`}>
      <Tabs
        className="!w-full flex-grow"
        type="card"
        onChange={onChange}
        activeKey={activeKey}
        items={items}
        hideAdd
        tabBarStyle={{ paddingRight: 0 }}
        tabBarGutter={0}
        tabBarExtraContent={
          <div className="flex flex-col relative" ref={containerRef}>
            <Input
              placeholder="Enter to search..."
              style={{ width: '500px', height: 33 }}
              onChange={onSearchChange}
              size="middle"
              allowClear
            />
            <div
              className={`p-3 bg-slate-200 rounded-md max-h-[50vh] mt-1 absolute w-full top-10 z-50 transition-opacity duration-500 ${
                openModalSearch && searchTerm ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ overflowY: 'auto' }} // Add scrollable behavior
            >
              <div className="flex flex-col gap-1 flex-wrap">
                {data &&
                  data.map(product => <ProductItem key={product._id} product={product} loading={isLoading} isList />)}
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default ProductLeft
