import React, { useState } from 'react'
import { Breadcrumb, Space, Spin, Table, DatePicker } from 'antd'
import { FileText, Home, Search } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@src/hooks'
import { convertDateWithTime } from '@src/utils'
import { useGetAllOrdersQuery } from '@src/redux/endPoint/order'
import { useColumnSearch } from '../common/column-search-props'
import TooltipCustom from '../common/tooltip'
import OrderDetailModal from './order-detail'

const OrderHistory = () => {
  const [formFilterData, setFormFilterData] = useState({
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10
  })

  const handleDateChange = dates => {
    if (dates && dates.length > 1) {
      const startDate = dates[0].startOf('day').toISOString()
      const endDate = dates[1].endOf('day').toISOString()
      setFormFilterData({ ...formFilterData, page: 1, fromDate: startDate, toDate: endDate })
    } else {
      setFormFilterData({ ...formFilterData, page: 1, fromDate: '', toDate: '' })
    }
  }

  console.log(formFilterData, 'formFilterData')

  const debouncedFormFilterData = useDebounce(formFilterData, 500)
  const { data: listOrders, isLoading: isLoadingListOrders } = useGetAllOrdersQuery(debouncedFormFilterData)

  const handleTableChange = pagination => {
    setFormFilterData({
      ...formFilterData,
      page: pagination.current,
      limit: pagination.pageSize
    })
  }

  // const handleChange = (name, value) => {
  //   setFormFilterData({
  //     ...formFilterData,
  //     [name]: value ?? '',
  //     page: name !== 'page' ? 1 : value
  //   })
  // }

  // const handleSearch = () => {
  //   setFormFilterData({
  //     ...formFilterData,
  //     fromDate: DateValue[0],
  //     toDate: DateValue[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
  //   })
  // }

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (formFilterData.page - 1) * formFilterData.limit + index + 1
    },
    {
      title: 'Total Money',
      dataIndex: 'totalMoney',
      key: 'totalMoney'
    },
    {
      title: 'Received Money',
      dataIndex: 'receivedMoney',
      key: 'receivedMoney'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (_, { createdBy }) => <>{createdBy?.firstName + ' ' + createdBy?.lastName}</>
    },
    {
      title: <div className="text-end">Created At</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => <div className="text-end">{convertDateWithTime(createdAt)}</div>
    },
    {
      title: <div className="text-end">Action</div>,
      key: 'action',
      render: (_, record) => (
        <div className="text-end">
          <Space size="middle">
            <TooltipCustom title="View Order Detail" color="blue">
              <OrderDetailModal orderId={record?._id} type="text" title="Edit menu info" />
            </TooltipCustom>
          </Space>
        </div>
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
            <DatePicker.RangePicker onChange={handleDateChange} />
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
