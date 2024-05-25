import React from 'react'
import {
  ProductOutlined,
  AreaChartOutlined,
  UsergroupAddOutlined,
  IdcardOutlined,
  UnorderedListOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  BookOutlined,
  SettingOutlined
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
    <Link href={'/admin'}>
      <AreaChartOutlined />
    </Link>
  ),
  getItem(
    'Products',
    '/admin/product',
    <Link href={'/admin/product'}>
      <ProductOutlined />
    </Link>
  ),
  getItem(
    'Account',
    '/admin/account',
    <Link href={'/admin/account'}>
      <UsergroupAddOutlined />
    </Link>
  ),
  getItem(
    'Employee',
    '/admin/employee',
    <Link href={'/admin/employee'}>
      <IdcardOutlined />
    </Link>
  ),
  getItem(
    'Menu',
    '/admin/menu',
    <Link href={'/admin/menu'}>
      <UnorderedListOutlined />
    </Link>
  ),
  getItem(
    'Product category',
    '/admin/product-category',
    <Link href={'/admin/product-category'}>
      <ContainerOutlined />
    </Link>
  ),
  getItem(
    'Salary',
    '/admin/salary',
    <Link href={'/admin/salary'}>
      <CreditCardOutlined />
    </Link>
  ),
  getItem(
    'Vouchers',
    '/admin/voucher',
    <Link href={'/admin/voucher'}>
      <BookOutlined />
    </Link>
  ),
  getItem(
    'General',
    '/admin/general',
    <Link href={'/admin/general'}>
      <SettingOutlined />
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
