import React, { useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space, Tag } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { Check, Home, List, X } from 'lucide-react'
import { useGetAllMenuInfoQuery, useUpdateMenuInfoMutation } from '@src/redux/endPoint/menuInfo'
import MenuInfoForm from './menuInfo-form'
import { convertDate } from '@src/utils'
import { STATUS_MENU_INFO } from '@src/constants'
import Notification from '../common/notification'
import Confirm from '../common/confirm'

const MenuInfo = () => {
  const { data: listMenuInfo, isLoading: isLoadingListMenuIno } = useGetAllMenuInfoQuery()
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const handleTableChange = pagination => {
    setPagination(pagination)
  }

  const ChangeStatus = ({ menuInfo }) => {
    const [updateNewMenuInfo] = useUpdateMenuInfoMutation()

    const handleChangeStatus = async () => {
      try {
        const body = {
          menuInfoId: menuInfo._id,
          status: !menuInfo.status
        }
        await updateNewMenuInfo(body).unwrap()
        Notification(
          'success',
          'Menu Info Manager',
          `${menuInfo?.status ? 'Set status active' : 'Set status inactive'} successfully`
        )
      } catch (error) {
        Notification('error', 'Account Manager', 'Failed call api')
      }
    }
    return (
      <Confirm
        icon={!menuInfo?.status ? <X className="m-auto text-t-red" /> : <Check className="m-auto text-t-green" />}
        title={menuInfo?.status ? 'Set status inactive' : 'Set status active'}
        color={menuInfo?.status ? 'red' : 'green'}
        type="text"
        message={`Are you sure you want to ${menuInfo?.status ? 'set status inactive' : 'set status active'} ${menuInfo?.name}?`}
        onConfirm={handleChangeStatus}
      />
    )
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: STATUS_MENU_INFO.map(item => {
        return { text: item.label, value: item.value }
      }),
      onFilter: (value, record) => {
        return record?.status == value
      },
      render: (_, { status }) => (
        <Tag color={status ? 'green' : 'red'} key={status}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      align: 'end',
      key: 'createdAt',
      render: (_, { createdAt }) => convertDate(createdAt)
    },
    {
      title: 'Updated At',
      align: 'end',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, { updatedAt }) => convertDate(updatedAt)
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <ChangeStatus menuInfo={record} />
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
            pagination={{ ...pagination }}
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
