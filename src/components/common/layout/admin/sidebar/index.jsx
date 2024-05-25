import React from 'react'
import {
  CalendarOutlined,
  AreaChartOutlined,
  ContainerOutlined,
  CheckSquareOutlined,
  UserOutlined,
  SolutionOutlined,
  CommentOutlined
} from '@ant-design/icons'
import { ConfigProvider, Layout, Menu } from 'antd'
import Logo from '~public/images/logo.png'
import Link from 'next/link'
import CustomImage from '&common/CustomImage'
const { Sider } = Layout

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}

const items = [
  getItem(
    'Dashboard',
    '1',
    <Link href={'/'}>
      <AreaChartOutlined />
    </Link>
  ),
  getItem(
    'Tickets',
    '/tickets',
    <Link href={'/order'}>
      <ContainerOutlined />
    </Link>
  ),
  getItem(
    'Booking',
    '/booking',
    <Link href={'/booking'}>
      <CheckSquareOutlined />
    </Link>
  ),
  getItem(
    'Reporting and Analysis',
    '/report',
    <Link href={'/report'}>
      <AreaChartOutlined />
    </Link>
  ),
  getItem(
    'Promotion ',
    '/promotion',
    <Link href={'/promotion'}>
      <SolutionOutlined />
    </Link>
  ),
  getItem(
    'Feedback',
    '/feedback',
    <Link href={'/feedback'}>
      <CommentOutlined />
    </Link>
  )
]
const Sidebar = ({ collapsed = false }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <Link className="w-full flex justify-center items-center mt-5" href="/">
        <CustomImage
          alt="logo"
          className="w-[170px] h-max object-contain aspect-[16/8] px-1"
          src={Logo.src}
          width={150}
          height={50}
        />
      </Link>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemColor: '#363A3D',
              itemSelectedBg: '#AA715B',
              itemSelectedColor: '#ffffff',
              dangerItemSelectedBg: '#AA715B',
              horizontalItemSelectedBg: '#AA715B',
              subMenuItemBg: 'none'
            }
          }
        }}
      >
        <Menu className="custom-transparent-menu custom-bg-submenu" mode="inline" items={items} />
      </ConfigProvider>
    </Sider>
  )
}

export default Sidebar
