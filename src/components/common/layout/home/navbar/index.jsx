import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLogoutMutation } from '@src/redux/endPoint/auth'
import { useSelector } from 'react-redux'
import Notification from '@src/components/common/notification'
import CustomImage from '@src/components/common/custom-image'
import Logo from '~public/images/logo.png'

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
    <Header className="p-0 !bg-gradient flex justify-between items-center px-4">
      <CustomImage
        alt="logo"
        className="w-[170px] h-max object-contain aspect-[16/8] px-1"
        src={Logo.src}
        width={150}
        height={50}
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
