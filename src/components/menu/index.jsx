import React, { useEffect, useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space, Tag } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { Home, List, TableProperties } from 'lucide-react'
import { convertDate } from '@src/utils'
import { useGetAllMenuQuery } from '@src/redux/endPoint/menu'
import MenuForm from './menu-form'

const Menu = () => {
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })

  const { data: listMenu, isLoading: isLoadingListMenu, refetch } = useGetAllMenuQuery(pagination)

  const handleChange = (name, value) => {
    setFormFilterData({
      ...formFilterData,
      [name]: value ?? '',
      page: name != 'page' ? 1 : value
    })
  }
  const handleTableChange = pagination => {
    setPagination({ page: pagination?.current, limit: pagination?.pageSize })
  }

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (pagination.page - 1) * pagination.limit + index + 1
    },
    {
      title: 'Menu name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Menu Name')
    },
    {
      title: 'Menu Info',
      dataIndex: 'menuInfoId',
      render: menuInfoId => (
        <Tag color="gold-inverse" className="w-max !m-0">
          {menuInfoId?.name}
        </Tag>
      )
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
            <MenuForm menuId={record?._id} type="text" title="Edit menu" successCallback={refetch} />
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
          <MenuForm title="Add new menu" label="New menu" successCallback={refetch} />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
            pagination={{
              total: listMenu?.options?.totalRecords,
              defaultCurrent: 1,
              current: listMenu?.options?.pageIndex,
              pageSize: listMenu?.options?.pageSize
            }}
            columns={columns}
            dataSource={listMenu?.metadata}
            rowKey="_id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default Menu
