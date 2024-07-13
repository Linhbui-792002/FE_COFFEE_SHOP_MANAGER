'use client'

import React, { useState } from 'react'
import { Layout } from 'antd'
const { Content } = Layout
import Navbar from './navbar'

const DefaultLayout = ({ children }) => {
  return (
    <Layout className="!bg-b-primary-from">
      <Navbar />
      <Content className="m-6 min-h-[calc(100vh-(64px+21px+21px))] rounded-md">{children}</Content>
    </Layout>
  )
}

export default DefaultLayout
