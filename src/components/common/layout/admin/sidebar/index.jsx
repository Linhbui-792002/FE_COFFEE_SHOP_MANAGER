import React, { useMemo } from 'react'
import { ConfigProvider, Layout, Menu } from 'antd'
import Logo from '~public/images/logo.png'
import Link from 'next/link'
import CustomImage from '@src/components/common/custom-image'
import { useRouter } from 'next/router'
import {
  Coffee,
  LayoutList,
  LayoutGrid,
  ScrollText,
  NotebookTabs,
  TableProperties,
  List,
  SquareUser,
  Users,
  Receipt,
  Ticket,
  Settings
} from 'lucide-react'
const { Sider } = Layout

const items = [
  {
    key: 'dashboard',
    label: <Link href={'/admin'}>Dashboard</Link>,
    icon: <LayoutGrid size={16} />
  },
  {
    key: 'account',
    label: <Link href={'/admin/account'}>Account</Link>,
    icon: <SquareUser size={16} />
  },
  {
    key: 'product',
    label: 'Products',
    icon: <Coffee size={16} />,
    children: [
      {
        key: 'productList',
        label: <Link href={'/admin/product/product-list'}>Product List</Link>,
        icon: <LayoutList size={16} />
      },
      {
        key: 'productCategory',
        label: <Link href={'/admin/product/product-category'}>Product Category</Link>,
        icon: <ScrollText size={16} />
      }
    ]
  },
  {
    key: 'menu',
    label: 'Menu',
    icon: <NotebookTabs size={16} />,
    children: [
      {
        key: 'menuList',
        label: <Link href={'/admin/menu/menu-list'}>Menu List</Link>,
        icon: <TableProperties size={16} />
      },
      {
        key: 'menuInfo',
        label: <Link href={'/admin/menu/menu-info'}>Menu Info</Link>,
        icon: <List size={16} />
      }
    ]
  },
  {
    key: 'voucher',
    label: <Link href={'/admin/voucher'}>Voucher</Link>,
    icon: <Ticket size={16} />
  },
  {
    key: 'employee',
    label: <Link href={'/admin/employee'}>Employee</Link>,
    icon: <Users size={16} />
  },
  {
    key: 'salary',
    label: <Link href={'/admin/salary'}>Salary</Link>,
    icon: <Receipt size={16} />
  },
  {
    key: 'general',
    label: <Link href={'/admin/general'}>General</Link>,
    icon: <Settings size={16} />
  }
]
const Sidebar = ({ collapsed = false }) => {
  const router = useRouter()

  const activeKey = useMemo(() => {
    if (router.asPath == '/admin') {
      return 'dashboard'
    }
    if (router.asPath.startsWith('/admin/account')) {
      return 'account'
    }
    if (router.asPath.startsWith('/admin/product/product-list')) {
      return 'productList'
    }

    if (router.asPath.startsWith('/admin/product/product-category')) {
      return 'productCategory'
    }
    if (router.asPath.startsWith('/admin/menu/menu-list')) {
      return 'menuList'
    }

    if (router.asPath.startsWith('/admin/menu/menu-info')) {
      return 'menuInfo'
    }

    if (router.asPath.startsWith('/admin/voucher')) {
      return 'voucher'
    }

    if (router.asPath.startsWith('/admin/employee')) {
      return 'employee'
    }
    if (router.asPath.startsWith('/admin/salary')) {
      return 'salary'
    }
    if (router.asPath.startsWith('/admin/general')) {
      return 'general'
    }
  }, [router])
  console.log(activeKey, 'activeKey')
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <Link className="w-full flex justify-center items-center mt-5" href="/admin">
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
        <Menu
          className="custom-transparent-menu custom-bg-submenu"
          mode="inline"
          items={items}
          selectedKeys={activeKey}
        />
      </ConfigProvider>
    </Sider>
  )
}

export default Sidebar
