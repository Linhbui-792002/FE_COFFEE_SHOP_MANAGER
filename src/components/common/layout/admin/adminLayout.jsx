import React, { useState } from 'react'
import { Layout } from 'antd'
const { Content } = Layout
import Sidebar from './sidebar'
import Navbar from './navbar'

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className="!bg-gradient-sidebar">
      <Sidebar collapsed={collapsed} />
      <Layout className="!bg-b-primary-from">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="my-6 mx-4 p-6 min-h-[100vh] rounded-md">{children}</Content>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout
