'use client'

import React, { useState } from 'react'
import { Layout } from 'antd'
const { Content } = Layout
import Sidebar from './sidebar'
import Navbar from './navbar'

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className="!bg-gradient-sidebar">
      <Sidebar collapsed={collapsed} />
      <Layout className="!bg-b-primary-from">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="mx-2 p-4 min-h-[100vh] rounded-md">{children}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
