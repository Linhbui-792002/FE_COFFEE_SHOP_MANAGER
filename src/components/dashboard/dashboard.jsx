import React, { useEffect, useState } from 'react'
import { Card, Divider, Input, InputNumber, Radio, Select, Space, Spin, Table } from 'antd'
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
import { useGetProductStatisticQuery } from '@src/redux/endPoint/statistic'
import { set } from 'react-hook-form'

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

const filterTime = [
  { value: '0', label: 'The whole year' },
  { value: '1', label: 'The first quarter' },
  { value: '2', label: 'The second quarter' },
  { value: '3', label: 'The third quarter' },
  { value: '4', label: 'The fourth quarter' },
  { value: '5', label: 'The first half of the year' },
  { value: '6', label: 'The second half of the year' }
];

const viewMode = [
  { value: '1', label: 'Highest revenue' },
  { value: '-1', label: 'Lowest revenue' }
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
  const filterOrderStatistic = { fromDate, toDate, limit: 10, page: 1 }

  const [dataProduct, setDataProduct] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [filterProductStatistic, setFilterProductStatistic] = useState({fromDate, toDate, limit: 10, page: 1});
  const [filterTimeMode, setFilterTimeMode] = useState(0);

  const [orderStatistic, setOrderStatistic] = useState(dataOrder)

  const dataOrderStatistic = { fromDate, toDate, limit: 10, page: 1 }

  //handle call API:
  const { //product chart
    data: dataProductStatistic,
    isLoading: isLoadingOrderStatistic,
    refetch: refetchProductStatistic
  } = useGetProductStatisticQuery(filterProductStatistic)

  const { //list order recent
    data: listOrdersRecent,
    isLoading: isLoadingOrderRecent,
    refetch: refetchListOrdersRecent
  } = useGetAllOrdersQuery(filterOrderStatistic, { pollingInterval: 10000 })

  const { //order analistic chart
    data: orderAnalistic,
    isLoading: isLoadingOrderAnalistic,
    refetch: refetchOrderAnalistic
  } = useGetAllOrdersQuery({}, { pollingInterval: 10000 })

  const { //order analistic chart
    data: revenueAnalistic,
    isLoading: isLoadingRevenueAnalistic,
    refetch: refetchRevenueAnalistic
  } = useGetAllOrdersQuery({}, { pollingInterval: 10000 })

  //hanlde data return:
  useEffect(() => {
    const dataReturn = dataProductStatistic;
    fillProductData(transformData(dataReturn));
  }, [dataProductStatistic])

  const renderStatisticCard = (title, value) => (
    <>
      <span className="w-100% font-medium">{title}</span>
      <div className="w-full text-end text-xl">{value}</div>
      <Divider style={{ margin: '10px 0' }} />
    </>
  )

  const updateRevenueChart = data => {
    //Set lại thời gian cho dữ liệu mẫu và nếu có dữ liệu thực thì update dự liệu thực
    const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));

    dataRevenue.forEach((item, index) => {
      const month = String(sixMonthAgo.getMonth() + 1 + index).padStart(2, '0')
      const year = sixMonthAgo.getFullYear()
      const date = `${month} - ${year}`
      const found = data.revenueData.find(data => data.month == date)
      if (found) {
        dataRevenue[index] = { found, name: date, revenue: found.revenue, profit: found.profit }
      } else {
        dataRevenue[index] = { ...item, name: date, revenue: 0, profit: 0 }
      }
    })
  }

  const handleChangeTimeProductChart = value => {
    setFilterTimeMode(value);
    // refetchProductStatistic();
  }

  //helper function:
  const transformData = (data) => {

    if (!Array.isArray(data)) return [];

    const setProduct = new Set();

    const ressult = {};

    data.forEach(item => {
      const { yearMonth, productName, productProfit } = item;

      if (ressult[yearMonth]) {
        ressult[yearMonth][productName] = productProfit;
      } else {
        ressult[yearMonth] = { yearMonth, [productName]: productProfit };
      }
      
      setProduct.add(item.productName)
    })

    setListProduct(Array.from(setProduct));

    return Object.values(ressult);
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fillProductData = (data) => {
    let agrs = [1, 12, data];
  
    switch (filterTimeMode) {
      case 1:
        agrs = [1, 3, data];
        break;
      case 2:
        agrs = [4, 6, data];
        break;
      case 3:
        agrs = [7, 9, data];
        break;
      case 4:
        agrs = [10, 12, data];
        break;
      case 5:
        agrs = [1, 6, data];
        break;
      case 6:
        agrs = [7, 12, data];
        break;
      }

      setDataProduct(createData(...agrs));
  }

  const createData = (startMonth, endMonth, dataBeatyfy) => {
    const data = [];
    const year = new Date().getFullYear();

    for (let i = startMonth; i <= endMonth; i++) {
      const tmpMonth = i < 10 ? '0' + i : i;
      
      const tmpObj = {
        yearMonth: tmpMonth + ' - ' + year,
      }
      listProduct.forEach(product => {
        tmpObj[product] = 0;
      })
      data.push(tmpObj);
    }
    data.forEach(item => {
      const found = dataBeatyfy.find(data => data.yearMonth == item.yearMonth);
      if (found) {
        item = Object.assign(item, found);
      }
    })

    return data;
  }

  return (
    <div className="flex">
      <div className="flex-grow w-[60%] flex flex-col">
        <div className="flex h-[310px]">
          <Card className="h-full grow-0" title="Total Per Day" style={{ width: '35%' }}>
            {renderStatisticCard('Orders (orders):', dataOrderStatistic?.orderAnalistic?.totalOrder || 0)}
            {renderStatisticCard(
              'Revenue (VND):',
              currencyFormatter(dataOrderStatistic?.orderAnalistic?.totalRevenue || 0, '')
            )}
            {renderStatisticCard(
              'Profit (VND):',
              currencyFormatter(dataOrderStatistic?.orderAnalistic?.totalProfit || 0, '')
            )}
          </Card>
          <Card className="h-full grow min-h-fit ml-3 w-[65%]" title="Revenue Chart">
            <ResponsiveContainer width="100%" height={220} style={{ zIndex: 9 }}>
              <LineChart data={dataRevenue} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis cursor={1} />
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
        <div className="mt-1 mb-3.5 w-full h-full flex-grow">
          <Card className="h-full" title="Product Chart">
            {/* filter for chart */}
            <div className="w-full flex">
              <div className="w-32 grow">
                <Space wrap>
                  <span>Select Time:</span>
                  <Select
                    defaultValue="0"
                    onChange={handleChangeTimeProductChart}
                    style={{ width: 220 }}
                    options={[...filterTime]}
                  ></Select>
                </Space>
              </div>
              {/* view mode */}
              <div className="w-20 grow justify-self-end">
                <Radio.Group defaultValue="1" options={viewMode} buttonStyle="solid" optionType='button' />
              </div>
              {/* number of product */}
              <div className="w-20 grow justify-self-end">
                <span>Number product:</span>
                <InputNumber className='ml-4 w-36' />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={dataProduct} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearMonth" />
                <YAxis />
                <Tooltip />
                <Legend />
                {listProduct.map((product, index) => {
                  const randomColor = getRandomColor();
                  return (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={product}
                      stroke={randomColor}
                      strokeWidth={2}
                      dot={{ stroke: randomColor, strokeWidth: 2, r: 4 }}
                    />
                  )
                })
                }
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
