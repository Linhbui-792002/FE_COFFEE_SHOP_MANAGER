import React from 'react'
import { Card } from 'antd'
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
  return (
    <>
      <div className="w-full text-center text-2xl">Admin DashBord</div>
      {/* Chia layout cho phần dashboard */}
      <div class="flex">
        <div className="flex-grow" style={{ flex: 8 }}>
          <div className="grid grid-rows-1 grid-flow-col gap-2 h-1/3">
            {/* <Card
              className="h-full"
              title="Most popular Product"
              cover={
                <img
                  alt="Ảnh cà phê"
                  style={{ width: 230, display: 'block', margin: 'auto', marginTop: '6px' }}
                  src="https://1.bp.blogspot.com/-7HUZMIomjZk/XjLh77L4_JI/AAAAAAAAg6c/QfJQgNMLhvMxQKDpmWP6vhK0qjmOF118gCLcBGAsYHQ/s1600/ty-le-pha-ca-phe-phin.png"
                />
              }
            >
              <Card.Meta style={{ marginLeft: '3px' }} title="Ca phe phin" description="18.000₫" />
            </Card> */}


            <Card className="h-full" title="Total">
              <span className="w-100%">
                Orders in day
              </span>
              <br/>
              <span className="w-full text-end">
                Orders in day
              </span>

              <Card style={{ marginTop: 4 }} type="inner" hoverable title="Revenue in day">
                5.000.000₫
              </Card>
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
        <div className="flex-grow" style={{ flex: 4 }}></div>
      </div>
    </>
  )
}

export default DashBoard
