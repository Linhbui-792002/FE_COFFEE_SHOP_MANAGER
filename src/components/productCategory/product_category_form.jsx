import { useUpdateAccountMutation, useGetListAccountNotEmployeeQuery } from '@src/redux/endPoint/account'
import { Button, Form, Input, Modal, Spin, Select, Switch, DatePicker, Radio, InputNumber, Divider, Tag } from 'antd'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import Notification from '../common/notification'
import { Pencil, UserRoundPlus } from 'lucide-react'
import TooltipCustom from '../common/tooltip'
import AccountForm from '../account/account-form'
import {
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetInfoEmployeeQuery
} from '@src/redux/endPoint/employee'
import dayjs from 'dayjs'
import {
  useAddProductCategoryMutation,
  useGetProductCategoryQuery,
  useUpdateProductCategoryMutation
} from '@src/redux/endPoint/productCategory'

const ProductCategoryForm = ({ label, productCategoryId, title, type, useSubComponent, getProductCategoryIdFn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    data: productCategoryData,
    isLoading: isLoadingProductCategoryData,
    refetch
  } = useGetProductCategoryQuery(productCategoryId, { skip: !productCategoryId || !isModalOpen })

  const [addProductCategory, { isLoading: isLoadingCreateProductCategory }] = useAddProductCategoryMutation()
  const [updateProductCategory, { isLoading: isLoadingUpdate }] = useUpdateProductCategoryMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      name: productCategoryData?.name
    })
  }, [productCategoryData])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddProductCategory = async body => {
    try {
      const res = await addProductCategory(body).unwrap()
      if (useSubComponent) {
        getProductCategoryIdFn(res?.metadata?._id)
      }
      Notification('success', 'Employee Manager', 'Create employee successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Employee Manager', error?.data?.message)
        default:
          return Notification('error', 'Employee Manager', 'Failed call api')
      }
    }
  }

  const handleUpdateProductCategory = async body => {
    try {
      await updateProductCategory({ ...body, productCategoryId }).unwrap()
      Notification('success', 'Product Category Manager', 'Update account successfully')
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Product Category Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Product Category Manager', error?.data?.message)
        default:
          return Notification('error', 'Product Category Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    if (productCategoryId) {
      handleUpdateProductCategory(values)
    } else {
      handleAddProductCategory(values)
    }
  }
  return (
    <Spin spinning={isLoadingProductCategoryData}>
      <Button
        type={type}
        icon={productCategoryId ? <Pencil className="m-auto text-t-blue" /> : <UserRoundPlus size={18} />}
        shape={productCategoryId ? 'circle' : 'default'}
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
        onCancel={handleCancel}
        width={400}
        okButtonProps={{ loading: isLoadingCreateProductCategory }}
        cancelButtonProps={{ disabled: isLoadingCreateProductCategory }}
        centered
      >
        <Spin spinning={false}>
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            disabled={isLoadingCreateProductCategory}
            form={form}
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <Form.Item
                  label="Product Category Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your product category name!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <Form.Item hidden>
              <Button type="primary" htmlType="submit" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Spin>
  )
}

export default ProductCategoryForm
