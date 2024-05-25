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
      <Dropdown
        menu={{
          items: MENU_ITEMS
        }}
      >
        <Button shape="circle" icon={<UserOutlined />}></Button>
      </Dropdown>
    </Header>
  )
}

export default Navbar
