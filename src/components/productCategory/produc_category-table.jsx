import React, { useState } from 'react'
import { Space, Table, Tag } from 'antd'
import { Check, X } from 'lucide-react'
import { useColumnSearch } from '../common/column-search-props'
import TooltipCustom from '../common/tooltip'
import ProductCategoryForm from './product_category_form'
import { convertDate } from '@src/utils'
import { STATUS_PRODUCT_CATEGORY } from '@src/constants'
import { useUpdateProductCategoryMutation } from '@src/redux/endPoint/productCategory'
import Confirm from '../common/confirm'
import Notification from '../common/notification'

const PAGESIZE = 5

const ProductCategoryTable = ({ className, categories }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const { getColumnSearchProps } = useColumnSearch()
  const handleTableChange = pagination => {
    setCurrentPage(pagination.current)
  }

  const ChangeStatus = ({ productCategory }) => {
    const [updateProductCategory] = useUpdateProductCategoryMutation()

    const handleChangeStatus = async () => {
      try {
        const body = {
          productCategoryId: productCategory._id,
          status: !productCategory.status
        }
        await updateProductCategory(body).unwrap()
        Notification(
          'success',
          'Product Category Manager',
          `${productCategory?.status ? 'Set status Active' : 'Set status Inactive'} successfully`
        )
      } catch (error) {
        Notification('error', 'Account Manager', 'Failed call api')
      }
    }
    return (
      <Confirm
        icon={
          !productCategory?.status ? <X className="m-auto text-t-red" /> : <Check className="m-auto text-t-green" />
        }
        title={productCategory?.status ? 'Set status inactive' : 'Set status active'}
        color={productCategory?.status ? 'red' : 'green'}
        type="text"
        message={`Are you sure you want to ${productCategory?.status ? 'set status inactive' : 'set status active'} ${productCategory?.name}?`}
        onConfirm={handleChangeStatus}
      />
    )
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
      width: '30%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      filter: STATUS_PRODUCT_CATEGORY.map(item => ({ text: item.label, value: item.value })),
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
      key: 'createdAt',
      align: 'end',
      width: '20%',
      render: (_, { createdAt }) => convertDate(createdAt)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '20%',
      align: 'end',
      render: (_, { updatedAt }) => convertDate(updatedAt)
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <Space size="middle">
          <ChangeStatus productCategory={record} />
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
