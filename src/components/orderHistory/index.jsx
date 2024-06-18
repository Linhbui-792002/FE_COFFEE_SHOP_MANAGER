import React, { useState } from 'react'
import { Breadcrumb, Empty, Input, Pagination, Space, Spin, Table, Tag } from 'antd'
import { FileText, Home, Search } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@src/hooks'
import { convertDate } from '@src/utils'
import { useGetAllOrdersQuery } from '@src/redux/endPoint/order'
import { useColumnSearch } from '../common/column-search-props'
import TooltipCustom from '../common/tooltip'

const OrderHistory = () => {
  const [formFilterData, setFormFilterData] = useState({
    keySearch: '',
    page: 1,
    limit: 10
  })

  const debouncedFormFilterData = useDebounce(formFilterData, 500)
  const { data: listOrders, isLoading: isLoadingListOrders } = useGetAllOrdersQuery(debouncedFormFilterData)
  const { getColumnSearchProps } = useColumnSearch()

  const handleTableChange = pagination => {
    setFormFilterData({
      ...formFilterData,
      page: pagination.current,
      limit: pagination.pageSize
    })
  }

  const handleChange = (name, value) => {
    setFormFilterData({
      ...formFilterData,
      [name]: value ?? '',
      page: name !== 'page' ? 1 : value
    })
  }

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (formFilterData.page - 1) * formFilterData.limit + index + 1
    },
    {
      title: 'Total Money',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      ...getColumnSearchProps('totalMoney', 'Total Money')
    },
    {
      title: 'Received Money',
      dataIndex: 'receivedMoney',
      key: 'receivedMoney',
      ...getColumnSearchProps('receivedMoney', 'Received Money')
    },
    {
      title: 'Excess Money',
      dataIndex: 'excessMoney',
      key: 'excessMoney',
      ...getColumnSearchProps('excessMoney', 'Excess Money')
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (_, { createdBy }) => createdBy
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => convertDate(createdAt)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit order" key="edit" color="blue">
            {/* <OrderForm orderId={record?._id} type="text" title="Edit order" /> */}
          </TooltipCustom>
        </Space>
      )
    }
  ]

  return (
    <Spin spinning={isLoadingListOrders}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" className="!flex gap-1 items-center w-max">
                <Home size={18} /> Home
              </Link>
            )
          },
          {
            title: (
              <span className="!flex gap-1 items-center w-max">
                <FileText size={18} /> Order
              </span>
            )
          }
        ]}
      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-12 bg-b-white rounded-md">
          <h1 className="text-2xl font-normal px-4 py-2">Order Manager</h1>
          <div className="flex justify-end gap-4 px-6">
            <Input
              placeholder="Enter order"
              prefix={<Search strokeWidth={1.25} />}
              size="middle"
              className="w-96"
              onChange={e => handleChange('keySearch', e.target.value)}
            />
          </div>
          <Spin spinning={isLoadingListOrders}>
            <div className="px-4 pb-5 mt-12">
              <Table
                pagination={{
                  current: listOrders?.options?.page,
                  pageSize: listOrders?.options?.pageSize,
                  total: listOrders?.options?.totalRecords
                }}
                columns={columns}
                dataSource={listOrders && listOrders?.metadata}
                rowKey="_id"
                onChange={handleTableChange}
              />
            </div>
          </Spin>
        </div>
      </div>
    </Spin>
  )
}

export default OrderHistory
