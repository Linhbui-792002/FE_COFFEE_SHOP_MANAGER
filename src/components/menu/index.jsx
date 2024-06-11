import React, { useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { Home, List, TableProperties } from 'lucide-react'
import { convertDate } from '@src/utils'
import { useGetAllMenuQuery } from '@src/redux/endPoint/menu'
import MenuForm from './menu-form'

const Menu = () => {
  const { data: listMenu, isLoading: isLoadingListMenu } = useGetAllMenuQuery()
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const handleTableChange = pagination => {
    setPagination(pagination)
  }

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: 'Menu name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Menu Name')
    },
    {
      title: 'Menu status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) =>
        status ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => convertDate(createdAt)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, { updatedAt }) => convertDate(updatedAt)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit menu" key="edit" color="blue">
            <MenuForm menuId={record?._id} type="text" title="Edit menu" />
          </TooltipCustom>
        </Space>
      )
    }
  ]

  return (
    <Spin spinning={isLoadingListMenu}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" className="!flex gap-1 items-center w-max">
                {' '}
                <Home size={18} /> Home
              </Link>
            )
          },
          {
            title: (
              <span className="!flex gap-1 items-center w-max">
                <TableProperties size={18} /> Menu
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Menu Manager</h1>
          <MenuForm title="Add new menu" label="New menu" />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
            pagination={{ ...pagination }}
            columns={columns}
            dataSource={listMenu}
            rowKey="_id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default Menu
