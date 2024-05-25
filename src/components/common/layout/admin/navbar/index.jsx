import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout } from 'antd'
import Link from 'next/link'
const { Header } = Layout

const Navbar = ({ collapsed, setCollapsed }) => {
  const MENU_ITEMS = [
    {
      key: '1',
      label: <Link href="/">Info</Link>
    },
    {
      key: '2',
      label: <p className="font-medium text-rose-600">Logout</p>
    }
  ]
  return (
    <Header className="p-0 !bg-b-primary-from flex justify-between items-center px-4">
      <Button
        type="text"
        shape="circle"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="text-lg cursor-pointer mr-5 bg-b-button text-b-white shadow-lg"
      />

      <Dropdown
        menu={{
          items: MENU_ITEMS
        }}
      >
        <Button type="text" icon={<UserOutlined />}>
          {' '}
          Linhbui
        </Button>
      </Dropdown>
    </Header>
  )
}

export default Navbar