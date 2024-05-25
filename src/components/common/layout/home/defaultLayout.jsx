import React, { useState } from 'react'
import { Layout } from 'antd'
const { Content } = Layout
import Navbar from './navbar'

const DefaultLayout = ({ children }) => {
  return (
    <Layout className="!bg-b-primary-from">
      <Navbar />
      <Content className="my-6 mx-4 p-6 min-h-[100vh] rounded-md">{children}</Content>
    </Layout>
  )
}

export default DefaultLayout
