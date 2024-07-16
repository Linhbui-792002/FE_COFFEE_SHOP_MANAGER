import React, { useEffect, useState } from 'react'
import { useColumnSearch } from '../common/column-search-props'
import { Breadcrumb, Spin, Table, Space, Tag } from 'antd'
import TooltipCustom from '../common/tooltip'
import Link from 'next/link'
import { Home, Ticket } from 'lucide-react'
import { convertDateWithTime } from '@src/utils'
import VoucherForm from './voucher-form'
import { useGetAllVoucherQuery } from '@src/redux/endPoint/voucher'

const Voucher = () => {
  const { getColumnSearchProps } = useColumnSearch()
  const [pagination, setPagination] = useState({ page:1, limit: 10 })
  const { data: listVoucher, isLoading: isLoadingListVoucher, refetch } = useGetAllVoucherQuery(pagination)

  const handleTableChange = pagination => {
    setPagination({page:pagination?.current,limit:pagination?.pageSize})
  }

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => (pagination.page - 1) * pagination.limit + index + 1
    },
    {
      title: 'Voucher name',
      dataIndex: 'name',
      ...getColumnSearchProps('name', 'Voucher name')
    },
    {
      title: 'Voucher code',
      dataIndex: 'code'
    },
    {
      title: 'Voucher percent',
      dataIndex: 'voucherPercent',
      render: (_, { voucherPercent }) => (
        <Tag color="gold-inverse" className="w-max !m-0">
          {voucherPercent + '%'}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, { type }) => (
        <Tag color={type ? 'gold' : 'purple'} className="w-max !m-0">
          {type ? 'Product' : 'Cart'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) =>
        status ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, { startDate }) => convertDateWithTime(startDate)
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (_, { endDate }) => convertDateWithTime(endDate)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit voucher" key="edit" color="blue">
            <VoucherForm voucherId={record?._id} type="text" title="Edit voucher" successCallback={refetch} />
          </TooltipCustom>
        </Space>
      )
    }
  ]

  return (
    <Spin spinning={isLoadingListVoucher}>
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
                <Ticket size={18} /> Voucher
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Voucher Manager</h1>
          <VoucherForm title="Add new voucher" label="New voucher" successCallback={refetch} />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
        pagination={{
          total:listVoucher?.options?.totalRecords,
          defaultCurrent:1,
          current:listVoucher?.options?.pageIndex,
          pageSize:listVoucher?.options?.pageSize
        }}
            columns={columns}
            dataSource={listVoucher}
            rowKey="_id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default Voucher
