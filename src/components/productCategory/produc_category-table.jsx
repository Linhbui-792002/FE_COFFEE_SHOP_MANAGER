import React, { useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Space, Table } from 'antd'
import { Highlighter } from 'lucide-react'
import { useColumnSearch } from '../common/column-search-props'
import TooltipCustom from '../common/tooltip'
import ProductCategoryForm from './product_category_form'
import { convertDate } from '@src/utils'

const PAGESIZE = 5

const ProductCategoryTable = ({ className, categories }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const { getColumnSearchProps } = useColumnSearch()
  const handleTableChange = pagination => {
    setCurrentPage(pagination.current)
  }
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (text, record, index) => {
        return (currentPage - 1) * PAGESIZE + index + 1
      }
    },
    {
      title: 'Product Category Name',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length
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
      align: 'right',
      render: (text, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit Product Category" key="edit" color="blue">
            <ProductCategoryForm productCategoryId={record?._id} type="text" title="Edit Product Category" />
          </TooltipCustom>
        </Space>
      )
    }
  ]
  return (
    <Table
      pagination={{ pageSize: PAGESIZE }}
      bordered
      className={className}
      columns={columns}
      dataSource={categories}
      onChange={handleTableChange}
    />
  )
}
export default ProductCategoryTable
