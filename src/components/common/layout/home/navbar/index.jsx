import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLogoutMutation } from '@src/redux/endPoint/auth'
import { useSelector } from 'react-redux'
const { Header } = Layout

const Navbar = () => {
  const account = useSelector(state => state.auth.account)
  const router = useRouter()
  const [logout, { isLoading, isError, error }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const res = await logout()
      if (res?.data?.status === 200) {
        router.replace('/')
      } else if (error) {
        Notification('error', 'Logout', 'Failed call api')
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
    <Header className="p-0 !bg-b-primary-from flex justify-end items-center px-4">
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
