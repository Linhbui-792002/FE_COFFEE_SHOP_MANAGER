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
import { useDebounce } from '@src/hooks'

const dataRevenue = [
  { name: '12 - 2023', revenue: 8000, profit: 0 },
  { name: '01 - 2024', revenue: 8500, profit: 0 },
  { name: '02 - 2024', revenue: 7500, profit: 0 },
  { name: '03 - 2024', revenue: 8600, profit: 0 },
  { name: '04 - 2024', revenue: 9000, profit: 9000 },
  { name: '05 - 2024', revenue: 8890, profit: 0 }
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

const dataProduct = [
  { yearMonth: '12 - 2023', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '01 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '02 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '03 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '04 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '05 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 0},
  { yearMonth: '06 - 2024', "Đồ ăn 1": 0, "Đồ ăn 2": 0, "Đồ uống 1": 0, "Đồ uống 2": 15000, "Combo mùa hè": 18000 },
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

  const debounced = useDebounce({}, 500);

  const {
    data: listOrdersRecent,
    isLoading: isLoadingOrderRecent,
    refetch: refetchListOrdersRecent
  } = useGetAllOrdersQuery(filter)

  const {
    data: dataOrderStatistic,
    isLoading: isLoadingOrderStatistic,
    refetch: refetchOrderStatistic
  } = useGetStatisticQuery(debounced, {pollingInterval : 10000})

  const [orderStatistic, setOrderStatistic] = useState(dataOrder)

  useEffect(() => {
    if (dataOrderStatistic?.orderAnalistic?.results?.length > 0) {
      updateOrderStatistic(dataOrderStatistic.orderAnalistic.results)
    }
    //update revenue chart
    if (dataOrderStatistic?.revenueAnalistic?.revenueData?.length) {
      updateRevenueChart(dataOrderStatistic.revenueAnalistic)
    }
    //update product chart
    if (dataOrderStatistic?.productStatistic?.productData?.length) {
      // updateProductChart(dataOrderStatistic.productStatistic.productData)
    }
  }, [dataOrderStatistic])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetchOrderStatistic()
  //     refetchListOrdersRecent()
  //   }, 10000)

  //   return () => clearInterval(interval)
  // }, [refetchOrderStatistic, refetchListOrdersRecent])

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

  const updateRevenueChart = (data) => {
    //Set lại thời gian cho dữ liệu mẫu và nếu có dữ liệu thực thì update dự liệu thực
    const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
    dataRevenue.forEach((item, index) => {
      const month = String(sixMonthAgo.getMonth() + 1 + index).padStart(2, '0');
      const year = sixMonthAgo.getFullYear();
      const date = `${month} - ${year}`;
      const found = data.revenueData.find(data => data.month == date);
      if (found) {
        dataRevenue[index] = { found, name: date, revenue: found.revenue, profit: found.profit }
      } else {
        dataRevenue[index] = { ...item, name: date, revenue: 0, profit: 0 };
      }
    })

  }

  const updateProductChart = (data) => {
    //Tạo set các sản phẩm được trả về
    const setProduct = new Set(data.map(item => item.productName));

    //Tạo mảng dữ liệu mới:
    const productExist = Array
      .from(setProduct)
      .map(item => ({
        productName: item,
        productProfit: 0, 
        yearMonth: ""
      }));

    //Xử lý dữ liệu API trả về:
    data = transformData(data);

  const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
  dataProduct.forEach((item, index) => {
    const month = String(sixMonthAgo.getMonth() + 1 + index).padStart(2, '0');
    const year = sixMonthAgo.getFullYear();
    const date = `${month} - ${year}`;
    //Xử lý thêm dữ liệu vào mảng dataProduct
    //name là yearMonth và dữ liệu là key _ value ==> productName _ profit
    const found = data.find(data => data.yearMonth == date);

    if (found) {
      console.log(found)
      dataProduct[index] = { ...item, yearMonth: date }
    } else {
      dataProduct[index] = { ...item, yearMonth: date, profit: 0 };
    }

  })
    console.log(dataProduct)
  }

  //Làm đẹp dữ liệu trả về từ API
  const transformData = (data) => {
    const transformedData = {};
  
    data.forEach((item) => {
      if (!transformedData[item.yearMonth]) {
        transformedData[item.yearMonth] = {};
      }
      transformedData[item.yearMonth][item.productName] = item.productProfit;
    });
  
    // Chuyển đổi đối tượng thành mảng
    return Object.keys(transformedData).map(yearMonth => {
      return {
        yearMonth,
        ...transformedData[yearMonth]
      };
    });
  };
  return (
    <div className="flex">
      <div className="flex-grow w-[60%] flex flex-col">
        <div className="flex h-[310px]">
          <Card className="h-full grow-0" title="Total Per Day" style={{ width: '35%' }}>
            {renderStatisticCard('Orders (orders):', dataOrderStatistic?.orderAnalistic?.totalOrder || 0)}
            {renderStatisticCard('Revenue (VND):', currencyFormatter(dataOrderStatistic?.orderAnalistic?.totalRevenue || 0, ''))}
            {renderStatisticCard('Profit (VND):', currencyFormatter(dataOrderStatistic?.orderAnalistic?.totalProfit || 0, ''))}
          </Card>
          <Card className="h-full grow min-h-fit ml-3 w-[65%]" title="Revenue Chart">
            <ResponsiveContainer width="100%" height={220} style={{ zIndex: 9 }}>
              <LineChart data={dataRevenue} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
                />

              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className="mt-3 w-full h-full flex-grow">
          <Card className="h-full" title="Product Chart">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={dataProduct} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearMonth" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Đồ uống 1" label="sản phẩm 1" stroke="#8884d8" />
                <Line type="monotone" dataKey="Đồ uống 2" stroke="#8884d8" />
                <Line type="monotone" dataKey="Đồ ăn 1" stroke="#8884d8" />
                <Line type="monotone" dataKey="Đồ ăn 2" stroke="#8884d8" />
                <Line type="monotone" dataKey="Combo mùa hè" stroke="#8884d8" />
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
