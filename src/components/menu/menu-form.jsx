import { Button, Form, Input, Modal, Spin, Select, Tag, Switch, Transfer, Table } from 'antd'
import { Pencil, TableProperties } from 'lucide-react'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import Notification from '../common/notification'
import { useCreateMenuMutation, useGetOneMenuQuery, useUpdateMenuMutation } from '@src/redux/endPoint/menu'
import { useGetAllMenuInfoQuery } from '@src/redux/endPoint/menuInfo'
import { useGetAllProductPublicQuery } from '@src/redux/endPoint/product'

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

const MenuForm = ({ label, menuId, title, type, successCallback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchMenuInfo, setSearchMenuInfo] = useState('')
  const [targetKeys, setTargetKeys] = useState([])

  const { data: dataMenu, isLoading: isLoadingMenu } = useGetOneMenuQuery(menuId, {
    skip: !menuId || !isModalOpen,
    refetchOnMountOrArgChange: true
  })
  const { data: dataMenuInfo, isLoading: isLoadingMenuInfo } = useGetAllMenuInfoQuery('/', {
    skip: !isModalOpen
  })

  const { data: dataListProduct, isLoading: isLoadingListProduct } = useGetAllProductPublicQuery('/', {
    skip: !isModalOpen
  })
  const [createNewMenu, { isLoading: isLoadingCreateMenu }] = useCreateMenuMutation()
  const [updateNewMenu, { isLoading: isLoadingUpdateMenu }] = useUpdateMenuMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ ...dataMenu })
    setTargetKeys(dataMenu?.productId)
  }, [dataMenu])

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

  const handleAddMenu = async body => {
    try {
      await createNewMenu(body).unwrap()
      Notification('success', 'Menu Manager', 'Create menu successfully')
      form.resetFields()
      handleCancel()
      successCallback?.()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Menu Manager', error?.data?.message)
        default:
          return Notification('error', 'Menu Manager', 'Failed call api')
      }
    }
  }

  const handleEditMenu = async body => {
    try {
      await updateNewMenu({ ...body, menuId }).unwrap()
      Notification('success', 'Menu Manager', 'Edit Menu successfully')
      handleCancel()
      successCallback?.()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Menu Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Menu Manager', error?.data?.message)
        default:
          return Notification('error', 'Menu Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    if (menuId) {
      handleEditMenu(values)
    } else {
      handleAddMenu(values)
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
    <Spin spinning={isLoadingMenu}>
      <Button
        type={type}
        icon={menuId ? <Pencil className="m-auto text-t-blue" /> : <TableProperties size={18} />}
        shape={menuId ? 'circle' : 'default'}
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
            <Form.Item
              label="Name menu"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your menu name!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Choose menu info"
              name="menuInfoId"
              rules={[
                {
                  required: true,
                  message: 'Please choose menu info!'
                }
              ]}
            >
              <Select
                loading={isLoadingMenuInfo}
                showSearch
                onSearch={setSearchMenuInfo}
                options={
                  filteredMenuInfo &&
                  filteredMenuInfo.map(item => ({
                    label: <Tag className="w-max !m-0">{item?.name}</Tag>,
                    value: item?._id
                  }))
                }
              />
            </Form.Item>
            <Form.Item className="col-span-3" label="Status" name="status" initialValue={true}>
              <Switch defaultValue={true} />
            </Form.Item>
            <Form.Item
              label="Choose Product menu"
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
            <Form.Item hidden>
              <Button type="primary" htmlType="submit" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Spin>
  )
}

export default MenuForm
