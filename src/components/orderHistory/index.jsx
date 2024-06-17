import React, { useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { FileText, Home, List } from 'lucide-react'
// import OrderForm from './order-form'
import { convertDate } from '@src/utils'
import { useGetAllOrdersQuery } from '@src/redux/endPoint/order'

const OrderHistory = () => {
  const { data: listOrders, isLoading: isLoadingListOrders } = useGetAllOrdersQuery()
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const handleTableChange = pagination => {
    setPagination(pagination)
  }

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
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
      render: (_, { createdBy }) => createdBy?.name // Assuming createdBy has a name field
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => convertDate(createdAt)
    }
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <TooltipCustom title="Edit order" key="edit" color="blue">
    //         <OrderForm orderId={record?._id} type="text" title="Edit order" />
    //       </TooltipCustom>
    //     </Space>
    //   )
    // }
  ]

  return (
    <Spin spinning={false}>
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
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Order Manager</h1>
          {/* <OrderForm title="Add new order" label="New order" /> */}
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
            pagination={{ ...pagination }}
            columns={columns}
            dataSource={listOrders}
            rowKey="_id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default OrderHistory
