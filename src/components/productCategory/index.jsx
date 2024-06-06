import { Breadcrumb, Spin } from 'antd'
import { Home, ScrollText } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProductCategoryTable from './produc_category-table'

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park'
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park'
  },
  {
    key: '5',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park'
  }
]

const ProductCategory = () => {
  const [isLoading, setIsLoading] = useState()
  const [categories, setCategories] = useState()
  const genDataCategory = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // format data have id increment
      const dataFormat = () => {
        return data.map((item, index) => {
          return {
            ...item,
            id: index + 1
          }
        })
      }
      setCategories(dataFormat)
    }, 2000)
  }

  useEffect(() => {
    genDataCategory()
  }, [])

  return (
    <Spin spinning={isLoading}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" className="!flex gap-1 items-center w-max">
                {' '}
                <Home size={18} /> Home
              </Link>
            )
          },
          {
            title: (
              <span className="!flex gap-1 items-center w-max">
                <ScrollText size={18} /> Product Category
              </span>
            )
          }
        ]}
      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-12 bg-b-white rounded-md">
          <h1 className="text-2xl font-normal px-4 py-2">Product Category Manager</h1>
          {/* <div className="flex justify-end gap-4 p-6">
            <Input
              placeholder="Enter username"
              prefix={<UserSearch strokeWidth={1.25} />}
              size="middle"
              className="!min-w-44 !max-w-52"
              onChange={e => handleChange('username', e.target.value)}
            />
            <Select
              onChange={value => handleChange('role', value)}
              allowClear={true}
              placeholder="Role"
              className="!min-w-32"
              options={Object.keys(ROLES)?.map(key => ({
                label: (
                  <Tag color={key == 'EMPLOYEE' ? 'blue' : 'gold'} className="w-max !m-0">
                    {key}
                  </Tag>
                ),
                value: ROLES[key]
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('onlineStatus', value)}
              placeholder="Status"
              className="!min-w-28"
              options={Object.keys(STATUS_ONLINE)?.map(key => ({
                label: (
                  <span
                    className={`w-max status ${STATUS_ONLINE[key] ? 'before:bg-b-green text-t-green' : 'before:bg-b-gray'}`}
                  >
                    {key}
                  </span>
                ),
                value: STATUS_ONLINE[key]
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('status', value)}
              placeholder="Block"
              className="!min-w-28"
              options={Object.keys(ACCOUNT_STATUS)?.map(key => ({
                label: (
                  <span className="flex items-center gap-2">
                    {' '}
                    {ACCOUNT_STATUS[key] ? (
                      <LockKeyhole size={12} className="text-t-red" />
                    ) : (
                      <LockKeyholeOpen size={12} className="text-t-green" />
                    )}{' '}
                    {key}
                  </span>
                ),
                value: ACCOUNT_STATUS[key]
              }))}
            />
          </div> */}
          <ProductCategoryTable categories={categories} className={'m-6'} />
          {/* <div className="col-span-12 my-4 mr-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={dataAccounts?.total}
              pageSize={ITEMS_PER_PAGE}
              onChange={handlePageChange}
              className="w-max"
            />
          </div> */}
        </div>
      </div>
    </Spin>
  )
}

export default ProductCategory
