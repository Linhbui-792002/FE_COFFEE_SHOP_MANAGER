import React, { useEffect, useState } from 'react'
import { Card, Divider, Space, Spin, Table } from 'antd'
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  BarChart,
  Bar
} from 'recharts'
import { useGetAllOrdersQuery } from '@src/redux/endPoint/order'
import { convertDateWithTime, currencyFormatter } from '@src/utils'
import OrderDetailModal from '../orderHistory/order-detail'
import TooltipCustom from '../common/tooltip'
import { useGetStatisticQuery } from '@src/redux/endPoint/statistic'

const dataRevenue = [
  { name: '12 - 2023', revenue: 8000 },
  { name: '01 - 2024', revenue: 8500 },
  { name: '02 - 2024', revenue: 7500 },
  { name: '03 - 2024', revenue: 8600 },
  { name: '04 - 2024', revenue: 9000 },
  { name: '05 - 2024', revenue: 8890 }
]

const dataOrder = [
  { name: '1:00', order: 0 },
  { name: '2:00', order: 0 },
  { name: '3:00', order: 0 },
  { name: '4:00', order: 0 },
  { name: '5:00', order: 0 },
  { name: '6:00', order: 0 },
  { name: '7:00', order: 0 },
  { name: '8:00', order: 0 },
  { name: '9:00', order: 0 },
  { name: '10:00', order: 0 },
  { name: '11:00', order: 0 },
  { name: '12:00', order: 0 },
  { name: '13:00', order: 0 },
  { name: '14:00', order: 0 },
  { name: '15:00', order: 0 },
  { name: '16:00', order: 0 },
  { name: '17:00', order: 0 },
  { name: '18:00', order: 0 },
  { name: '19:00', order: 0 },
  { name: '20:00', order: 0 },
  { name: '21:00', order: 0 },
  { name: '22:00', order: 0 },
  { name: '23:00', order: 0 },
  { name: '24:00', order: 0 }
]

const columns = [
  {
    title: <div>Created At</div>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (_, { createdAt }) => <div>{convertDateWithTime(createdAt)}</div>
  },
  {
    title: 'Total Money',
    dataIndex: 'totalMoney',
    key: 'totalMoney'
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy',
    key: 'createdBy',
    render: (_, { createdBy }) => <>{createdBy?.firstName + ' ' + createdBy?.lastName}</>
  },
  {
    title: <div className="text-end">Detail</div>,
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

const DashBoard = () => {
  const now = new Date()
  const fromDate = new Date(now.setHours(0, 0, 0, 0)).toISOString()
  const toDate = new Date(now.setHours(23, 59, 59, 0)).toISOString()
  const filter = { fromDate, toDate, limit: 10, page: 1 }

  const {
    data: listOrdersRecent,
    isLoading: isLoadingOrderRecent,
    refetch: refetchListOrdersRecent
  } = useGetAllOrdersQuery(filter)
  const {
    data: dataOrderStatistic,
    isLoading: isLoadingOrderStatistic,
    refetch: refetchOrderStatistic
  } = useGetStatisticQuery()

  const [orderStatistic, setOrderStatistic] = useState(dataOrder)

  useEffect(() => {
    if (dataOrderStatistic?.results?.length > 0) {
      updateOrderStatistic(dataOrderStatistic.results)
    }
  }, [dataOrderStatistic])

  useEffect(() => {
    const interval = setInterval(() => {
      refetchOrderStatistic()
      refetchListOrdersRecent()
    }, 10000)

    return () => clearInterval(interval)
  }, [refetchOrderStatistic, refetchListOrdersRecent])

  const updateOrderStatistic = results => {
    const updatedOrderStatistic = dataOrder.map(item => {
      const found = results.find(data => data._id == item.name.split(':')[0])
      return found ? { ...item, order: found.count } : item
    })
    setOrderStatistic(updatedOrderStatistic)
  }

  const renderStatisticCard = (title, value) => (
    <>
      <span className="w-100% font-medium">{title}</span>
      <div className="w-full text-end text-xl">{value}</div>
      <Divider style={{ margin: '10px 0' }} />
    </>
  )

  return (
    <div className="flex">
      <div className="flex-grow w-[60%] flex flex-col">
        <div className="flex h-[310px]">
          <Card className="h-full grow-0" title="Total Per Day" style={{ width: '35%' }}>
            {renderStatisticCard('Orders (orders):', dataOrderStatistic?.totalOrder || 0)}
            {renderStatisticCard('Revenue (VND):', currencyFormatter(dataOrderStatistic?.totalRevenue || 0, ''))}
            {renderStatisticCard('Profit (VND):', currencyFormatter(dataOrderStatistic?.totalProfit || 0, ''))}
          </Card>
          <Card className="h-full grow min-h-fit ml-3 w-[65%]" title="Revenue Chart">
            <ResponsiveContainer width="100%" height={220} style={{ zIndex: 9 }}>
              <LineChart data={dataRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className="mt-3 w-full h-full flex-grow">
          <Card className="h-full" title="Revenue Chart">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={dataRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <div className="ml-3 w-[40%] flex">
        <Card className="flex-grow" title="Order Recent">
          <div>
            <div className="font-medium">Order Analytics</div>
            <Spin spinning={isLoadingOrderStatistic} className="mx-auto">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart width={'100%'} data={orderStatistic} margin={{ top: 5, right: 3, left: 3, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    align="left"
                    wrapperStyle={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  />
                  <Bar dataKey="order" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Spin>
          </div>
          <Divider style={{ margin: '20px 0' }} />
          <Spin spinning={isLoadingOrderRecent}>
            <Table
              className="-t-8"
              rowHoverBg="#fafafa"
              pagination={false}
              rowKey="_id"
              dataSource={listOrdersRecent?.metadata}
              columns={columns}
            />
          </Spin>
        </Card>
      </div>
    </div>
  )
}

export default DashBoard
