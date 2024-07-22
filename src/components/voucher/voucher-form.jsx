import { Button, Form, Input, Modal, Spin, Select, Tag, Switch, Transfer, Table, InputNumber, DatePicker } from 'antd'
import { Pencil, Ticket } from 'lucide-react'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import Notification from '../common/notification'
import { useGetAllMenuInfoQuery } from '@src/redux/endPoint/menuInfo'
import { useGetAllProductPublicQuery } from '@src/redux/endPoint/product'
import { useCreateVoucherMutation, useGetOneVoucherQuery, useUpdateVoucherMutation } from '@src/redux/endPoint/voucher'
import dayjs from 'dayjs'

const TableTransfer = ({ leftColumns, rightColumns, targetKeys, ...restProps }) => (
  <Transfer {...restProps} targetKeys={targetKeys} rowKey={record => record._id} render={item => item.name}>
    {({
      direction,
      filteredItems,
      onItemSelect,
      onItemSelectAll,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns
      const rowSelection = {
        getCheckboxProps: () => ({
          disabled: listDisabled
        }),
        onChange(selectedRowKeys) {
          onItemSelectAll(selectedRowKeys, 'replace')
        },
        selectedRowKeys: listSelectedKeys,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE]
      }
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{
            pointerEvents: listDisabled ? 'none' : undefined
          }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) {
                return
              }
              onItemSelect(key, !listSelectedKeys.includes(key))
            }
          })}
        />
      )
    }}
  </Transfer>
)

const VoucherForm = ({ label, voucherId, title, type, successCallback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchMenuInfo, setSearchMenuInfo] = useState('')
  const [targetKeys, setTargetKeys] = useState([])

  const { data: dataVoucher, isLoading: isLoadingVoucher } = useGetOneVoucherQuery(voucherId, {
    skip: !voucherId || !isModalOpen,
    refetchOnMountOrArgChange: true
  })
  const { data: dataMenuInfo, isLoading: isLoadingMenuInfo } = useGetAllMenuInfoQuery('/', {
    skip: !isModalOpen
  })

  const { data: dataListProduct, isLoading: isLoadingListProduct } = useGetAllProductPublicQuery('/', {
    skip: !isModalOpen
  })
  const [createNewVoucher, { isLoading: isLoadingCreateMenu }] = useCreateVoucherMutation()
  const [updateVoucher, { isLoading: isLoadingUpdateMenu }] = useUpdateVoucherMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()
  useEffect(() => {
    dataVoucher &&
      form.setFieldsValue({ ...dataVoucher, dateRange: [dayjs(dataVoucher.startDate), dayjs(dataVoucher.endDate)] })

    setTargetKeys(dataVoucher?.productId)
  }, [dataVoucher, isLoadingVoucher, isModalOpen])

  const typeVoucher = Form.useWatch('type', form)
  const dateRange = Form.useWatch('dateRange', form)

  const filteredMenuInfo = useMemo(() => {
    return dataMenuInfo?.filter(menu => menu?.name?.toLowerCase().includes(searchMenuInfo?.toLowerCase()))
  }, [searchMenuInfo, dataMenuInfo, isLoadingMenuInfo])

  const categoryFilters = useMemo(() => {
    const uniqueCategories = [...new Set(dataListProduct?.map(item => item?.categoryId?.name))]
    return uniqueCategories.map(category => ({ text: category, value: category }))
  }, [dataListProduct])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onChangeProductId = nextTargetKeys => {
    setTargetKeys(nextTargetKeys)
  }
  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setTargetKeys([])
  }

  const handleAddVoucher = async body => {
    try {
      await createNewVoucher(body).unwrap()
      Notification('success', 'Voucher Manager', 'Create menu successfully')
      form.resetFields()
      handleCancel()
      successCallback?.()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Voucher Manager', error?.data?.message)
        case 400:
          return Notification('error', 'Voucher Manager', error?.data?.message)
        default:
          return Notification('error', 'Voucher Manager', 'Failed call api')
      }
    }
  }

  const handleEditVoucher = async body => {
    try {
      await updateVoucher({ ...body, voucherId }).unwrap()
      Notification('success', 'Voucher Manager', 'Edit Voucher successfully')
      handleCancel()
      successCallback?.()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Voucher Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Voucher Manager', error?.data?.message)
        default:
          return Notification('error', 'Voucher Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    const startDate = values?.dateRange[0]?.format('YYYY-MM-DD HH:mm:ss')
    const endDate = values?.dateRange[1]?.format('YYYY-MM-DD HH:mm:ss')
    const body = { ...values, startDate, endDate }
    if (voucherId) {
      handleEditVoucher(body)
    } else {
      handleAddVoucher(body)
    }
  }

  const columns = [
    {
      dataIndex: '_id',
      title: 'Id',
      render: _id => <span className="hidden">{_id}</span>
    },
    {
      dataIndex: 'name',
      title: 'Name'
    },
    {
      dataIndex: 'categoryId',
      title: 'Category',
      render: categoryId => (
        <Tag color="gold-inverse" className="w-max !m-0">
          {categoryId?.name}
        </Tag>
      ),
      filters: categoryFilters,
      onFilter: (value, record) => record.categoryId?.name.includes(value)
    },
    {
      dataIndex: 'isCombo',
      title: 'Is Combo',
      render: isCombo => (
        <Tag color={isCombo ? 'gold' : 'red'} className="w-max !m-0">
          {isCombo ? 'Combo' : 'Product'}
        </Tag>
      ),
      filters: [
        { text: 'Combo', value: true },
        { text: 'Product', value: false }
      ],
      onFilter: (value, record) => record.isCombo === value
    }
  ]
  return (
    <Spin spinning={isLoadingVoucher}>
      <Button
        type={type}
        icon={voucherId ? <Pencil className="m-auto text-t-blue" /> : <Ticket size={18} />}
        shape={voucherId ? 'circle' : 'default'}
        onClick={showModal}
        className="flex items-center w-max"
      >
        {label}
      </Button>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        okText="Submit"
        width={900}
        onCancel={handleCancel}
        okButtonProps={{ loading: isLoadingCreateMenu || isLoadingUpdateMenu }}
        cancelButtonProps={{ disabled: isLoadingCreateMenu || isLoadingUpdateMenu }}
        centered
      >
        <Spin spinning={false}>
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            disabled={isLoadingCreateMenu || isLoadingUpdateMenu}
            form={form}
          >
            <div className="w-full grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <Form.Item
                  label="Name voucher"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your voucher name!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Code voucher"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your code name!'
                    },
                    {
                      pattern: /^[A-Z0-9]+$/,
                      message: 'Code voucher cannot contain special characters or spaces and must be uppercase!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Detail voucher"
                  name="detail"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your detail!'
                    }
                  ]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  label="Voucher percent"
                  name="voucherPercent"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your voucher percent!'
                    }
                  ]}
                >
                  <InputNumber min={0} max={100} className="w-full" suffix="%" />
                </Form.Item>
              </div>
              <div className="col-span-6">
                <Form.Item
                  name="dateRange"
                  label="Date Range"
                  rules={[
                    {
                      type: 'array',
                      required: true,
                      message: 'Please select date range!'
                    }
                  ]}
                >
                  <DatePicker.RangePicker
                    showTime
                    format={{
                      format: 'YYYY-MM-DD HH:mm:ss',
                      type: 'mask'
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Max discount"
                  name="maxDiscount"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your max discount!'
                    }
                  ]}
                >
                  <InputNumber min={0} className="w-full" suffix="VNĐ" />
                </Form.Item>
                <Form.Item
                  label="Number voucher"
                  name="numberVoucher"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your number voucher!'
                    }
                  ]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
                <div className="w-full flex gap-3">
                  <Form.Item className="col-span-3" label="Status" name="status" initialValue={true}>
                    <Switch defaultValue={true} />
                  </Form.Item>
                  {/* <Form.Item className="col-span-3" label="Auto use" name="autoUse" initialValue={true}>
                    <Switch defaultValue={false} />
                  </Form.Item> */}
                </div>
              </div>
            </div>

            <Form.Item
              className="col-span-3"
              label="Type voucher use (Product: On, Cart: Off)"
              name="type"
              initialValue={true}
            >
              <Switch defaultValue={true} />
            </Form.Item>
            {typeVoucher && (
              <Form.Item
                label="Choose Product"
                name="productId"
                rules={[
                  {
                    required: true,
                    message: 'Please choose at least one product!'
                  }
                ]}
              >
                <TableTransfer
                  dataSource={dataListProduct}
                  targetKeys={targetKeys}
                  showSearch
                  showSelectAll={false}
                  onChange={onChangeProductId}
                  filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
                  leftColumns={columns}
                  rightColumns={columns}
                />
              </Form.Item>
            )}
            <Form.Item hidden>
              <Button type="primary" htmlType="submit" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Spin>
  )
}

export default VoucherForm
