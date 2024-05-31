import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout } from 'antd'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useLogoutMutation } from '@src/redux/endPoint/auth'
import { useRouter } from 'next/router'
import Notification from '@src/components/common/notification'
const { Header } = Layout

const Navbar = ({ collapsed, setCollapsed }) => {
  const account = useSelector(state => state.auth.account)
  const router = useRouter()
  const [logout, { isLoading, isError, error }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const res = await logout()
      if (res?.data?.status === 200) {
        router.replace('/')
      }
    } catch (error) {
      Notification('error', 'Logout', 'Failed call api')
    }
  }

  const MENU_ITEMS = [
    {
      key: '1',
      label: <Link href="/">Info</Link>
    },
    {
      key: '2',
      label: (
        <p className="font-medium text-rose-600" onClick={handleLogout}>
          Logout
        </p>
      )
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
          {account?.username}
        </Button>
      </Dropdown>
    </Header>
  )
}

export default Navbar
