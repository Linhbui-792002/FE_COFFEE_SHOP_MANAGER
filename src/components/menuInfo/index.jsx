import React, { useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { Home, List } from 'lucide-react'
import { useGetAllMenuInfoQuery } from '@src/redux/endPoint/menuInfo'
import MenuInfoForm from './menuInfo-form'
import { convertDate } from '@src/utils'

const MenuInfo = () => {
  const { data: listMenuInfo, isLoading: isLoadingListMenuIno } = useGetAllMenuInfoQuery()
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 })

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: 'Menu info name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Menu Info Name')
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => convertDate(createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, { updatedAt }) => convertDate(updatedAt),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit menu info" key="edit" color="blue">
            <MenuInfoForm menuInfoId={record?._id} type="text" title="Edit menu info" />
          </TooltipCustom>
        </Space>
      )
    }
  ]

  return (
    <Spin spinning={isLoadingListMenuIno}>
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
                <List size={18} /> Menu Info
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Menu Info Manager</h1>
          <MenuInfoForm title="Add new menu info" label="New menu info" />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
            pagination={{ ...pagination, pageSize: 5 }}
            columns={columns}
            dataSource={listMenuInfo}
            rowKey="_id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default MenuInfo
