import React, { useEffect, useState } from 'react'
import { Card, Space, Spin, Table } from 'antd'
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
import { convertDateWithTime } from '@src/utils'
import OrderDetailModal from '../orderHistory/order-detail'
import TooltipCustom from '../common/tooltip'

const dataRevenue = [
  { name: '06 - 2023', revenue: 4000 },
  { name: '07 - 2023', revenue: 3000 },
  { name: '08 - 2023', revenue: 4600 },
  { name: '09 - 2023', revenue: 4800 },
  { name: '10 - 2023', revenue: 5500 },
  { name: '11 - 2023', revenue: 7200 },
  { name: '12 - 2023', revenue: 8000 },
  { name: '01 - 2024', revenue: 8500 },
  { name: '02 - 2024', revenue: 7500 },
  { name: '03 - 2024', revenue: 8600 },
  { name: '04 - 2024', revenue: 9000 },
  { name: '05 - 2024', revenue: 8890 }
]

const dataOrder = [
  { name: '9:00 AM', order: 10 },
  { name: '10:00 AM', order: 0 },
  { name: '11:00 AM', order: 5 },
  { name: '12:00 PM', order: 15 },
  { name: '13:00 PM', order: 8 },
  { name: '14:00 PM', order: 5 },
  { name: '15:00 PM', order: 7 },
  { name: '16:00 PM', order: 4 },
  { name: '17:00 PM', order: 0 },
  { name: '18:00 PM', order: 3 },
  { name: '19:00 PM', order: 16 },
  { name: '20:00 PM', order: 20 },
  { name: '21:00 PM', order: 38 },
  { name: '22:00 PM', order: 16 }
]

const DashBoard = () => {
  //declare variable:
  const now = new Date(2024, 5, 28);

  //convert to ISO string
  const fromDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const toDate = new Date(now.setHours(23, 59, 59, 0)).toISOString();

  //todo: Lấy dữ liệu order recent
  const [orderInDay, setOrderInDay] = useState(0);
  const [orderRecent, setOrderRecent] = useState([])
  const filter = {
    fromDate: fromDate,
    toDate: toDate,
    limit: 10,
    page: 1,
    // sort: -1
  }
  const { data: listOrdersRecent, isLoading: isLoadingOrderRecent } = useGetAllOrdersQuery(filter)

  useEffect(() => {
    if (listOrdersRecent) {
      setOrderInDay(listOrdersRecent?.options?.totalRecords);
      setOrderRecent(listOrdersRecent.metadata);
    }
  }, [listOrdersRecent])

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

  return (
    <>
      <Spin spinning={isLoadingOrderRecent}>
        <div className="w-full text-center text-2xl">Admin DashBord</div>
        {/* Chia layout cho phần dashboard */}
        <div className="flex">
          {/* nửa bên trái */}
          <div className="flex-grow" style={{ flex: 8 }}>
            <div className="grid grid-rows-1 grid-flow-col gap-2 h-1/3">

              <Card className="h-full" title="Total">
                <span className="w-100%">Orders in day:</span>
                <br />
                <div className="w-full text-end text-xl">{orderInDay} orders</div>

                <hr className="my-5" />

                <span className="w-100%">Revenue in day:</span>
                <br />
                <div className="w-full text-end text-xl">5.000.000₫</div>
              </Card>

              <Card className="h-full" title="Order Analytics">
                <ResponsiveContainer width="78%" height={200}>
                  <BarChart data={dataOrder} margin={{ top: 5, right: 3, left: 3, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="order" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Phẩn bảng doanh thu */}
            <div className="mt-3 w-full h-fit">
              <Card className="h-full" title="Revenue Chart">
                <ResponsiveContainer width="100%" height={400}>
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

          {/* nửa bên phải */}
          <div className="flex-grow" style={{ flex: 4, maxHeight: '93%' }}>
            <Card className="h-full ml-3" title="Order Recent">
              <Table 
                class="-t-8"
                rowHoverBg="#fafafa" 
                pagination={false} 
                key={orderRecent?._id}
                dataSource={orderRecent} 
                columns={columns} />
            </Card>
          </div>
        </div>
      </Spin>
    </>
  )
}

export default DashBoard
