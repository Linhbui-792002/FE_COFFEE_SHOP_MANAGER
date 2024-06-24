import { Button, Card, Form, Input, Modal, Select, Spin, Switch, Tag } from 'antd'
import { ClipboardPlus, Pencil, SquareX } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import UploadImage from '../common/uploadImage'
import {
  useAddProductMutation,
  useGetAllProductPublicQuery,
  useGetProductInfoQuery,
  useUpdateProductMutation
} from '@src/redux/endPoint/product'
import CustomImage from '../common/custom-image'
import { useGetAllProductCategoryQuery } from '@src/redux/endPoint/productCategory'
import Notification from '../common/notification'

const ProductForm = ({ productId, title, type, label }) => {
  const [searchProduct, setSearchProduct] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef(null)
  const [form] = Form.useForm()
  const isCombo = Form.useWatch('isCombo', form)
  const productCombo = Form.useWatch('productCombo', form)

  const { data: dataProductPublic, isLoading: isLoadingProductPublic } = useGetAllProductPublicQuery('/', {
    skip: !isModalOpen
  })

  const { data: dataProductCate, isLoading: isLoadingProductCate } = useGetAllProductCategoryQuery('/', {
    skip: !isModalOpen
  })

  const { data: productInfo, isLoading: isLoadingProductInfo } = useGetProductInfoQuery(productId, {
    skip: !isModalOpen || !productId
  })
  const [addNewProduct, { isLoading: isLoadingAddProduct }] = useAddProductMutation()
  const [updateProduct, { isLoading: isLoadingUpdateProduct }] = useUpdateProductMutation()

  useEffect(() => {
    if (productInfo) {
      const productCombo = productInfo?.productCombo?.map(item => ({
        productId: { value: item?.productId?._id, label: item?.productId?.name },
        quantity: item.quantity
      }))
      console.log(productCombo, 'productCombo123å')
      form.setFieldsValue(productInfo)
      form.setFieldValue('productCombo', productCombo)
    }
  }, [productInfo, isLoadingProductInfo])

  useEffect(() => {
    if (!isCombo) {
      form.setFieldValue('productCombo', [])
    }
    getCostPrice()
  }, [isCombo, productCombo])
  console.log(productInfo?.productCombo, 'productCombo')
  const optionsProductPublic = useMemo(() => {
    const selectedProductIds = productCombo?.map(item => item?.productId?.value)
    console.log(selectedProductIds, 'selectedProductIds')
    return dataProductPublic?.filter(
      item => item.name.toLowerCase().includes(searchProduct.toLowerCase()) && !selectedProductIds?.includes(item._id)
    )
  }, [dataProductPublic, searchProduct, productCombo])

  const getCostPrice = () => {
    const totalCostPrice = dataProductPublic?.reduce((total, product) => {
      const selectedItem = productCombo?.find(item => item?.productId?.value === product._id)
      return total + (selectedItem?.quantity || 0) * product?.costPrice
    }, 0)
    form.setFieldValue('costPrice', totalCostPrice)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    if (productId) {
      form.resetFields()
    }
    setIsModalOpen(false)
  }

  const getImage = data => {
    form.setFieldValue('image', data)
  }

  const handleAddProduct = async payload => {
    try {
      await addNewProduct(payload).unwrap()
      Notification('success', 'Product Manager', 'Create product successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Product Manager', error?.data?.message)
        case 400:
          return Notification('error', 'Product Manager', error?.data?.message)
        default:
          return Notification('error', 'Product Manager', 'Failed call api')
      }
    }
  }
  const handleUpdateProduct = async payload => {
    try {
      await updateProduct(payload).unwrap()
      Notification('success', 'Product Manager', 'Update product successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Product Manager', error?.data?.message)
        case 400:
          return Notification('error', 'Product Manager', error?.data?.message)
        default:
          return Notification('error', 'Product Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    const updatedProductCombo =
      values?.productCombo?.map(item => ({
        productId: item.productId.value,
        quantity: item.quantity
      })) || []
    const payload = { ...values, productCombo: [...updatedProductCombo] }
    if (productId) {
      handleUpdateProduct({ ...payload, productId })
    } else {
      handleAddProduct(payload)
    }
  }

  return (
    <Spin spinning={isLoadingProductPublic || isLoadingProductInfo}>
      <Button
        type={type}
        icon={productId ? <Pencil className="m-auto text-t-blue" /> : <ClipboardPlus size={18} />}
        shape={productId ? 'circle' : 'default'}
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
        width={800}
        okButtonProps={{ loading: isLoadingAddProduct || isLoadingProductPublic }}
        cancelButtonProps={{ disabled: isLoadingAddProduct || isLoadingProductPublic }}
        centered
      >
        <Spin spinning={false}>
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            // disabled={isLoading}
            form={form}
          >
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <div className="mt-5">
                  <Form.Item name="image" valuePropName="fileList">
                    <UploadImage getDataFn={getImage} setData={form.getFieldValue('image')} />
                    <span>Upload image product</span>
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-8 grid grid-cols-12 gap-2">
                <Form.Item
                  className="col-span-12"
                  label="Name product"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your name product!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="col-span-12"
                  label="Detail"
                  name="detail"
                  rules={[
                    {
                      required: true,
                      message: 'Please input product detail!'
                    }
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  className="w-full col-span-5"
                  label="Choose product category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose product category!'
                    }
                  ]}
                >
                  <Select
                    loading={isLoadingProductCate}
                    allowClear={true}
                    options={dataProductCate?.map(item => ({
                      label: <Tag className="w-max !m-0">{item?.name}</Tag>,
                      value: item?._id
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  className="col-span-4"
                  label="Product quantity"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: 'Please input product quantity!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item className="col-span-3" label="Status" name="status" initialValue={true}>
                  <Switch defaultValue={true} />
                </Form.Item>

                <Form.Item className="col-span-3" label="Combo" name="isCombo" initialValue={false}>
                  <Switch defaultValue={false} />
                </Form.Item>

                <Form.Item
                  className="col-span-4"
                  label="Cost price"
                  name="costPrice"
                  rules={[
                    {
                      required: true,
                      message: 'Please input cost price!'
                    }
                  ]}
                >
                  <Input readOnly={isCombo} />
                </Form.Item>

                <Form.Item
                  className="col-span-4"
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: 'Please input price!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              {isCombo && (
                <div className="col-span-12">
                  <Form.List
                    name="productCombo"
                    rules={[
                      {
                        validator: async (_, names) => {
                          if (!names || names.length < 2) {
                            return Promise.reject(new Error('At least 2 product'))
                          }
                        }
                      }
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <div className="">
                        <Form.Item className="col-span-4">
                          <Button type="dashed" onClick={() => add()}>
                            Add product
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                        <div className="min-h-[10rem] grid grid-cols-12 gap-3 border-[1px] border-dashed border-b-gray rounded-md">
                          {fields.map((field, index) => (
                            <Card
                              className="col-span-4 h-max m-4 !p-1"
                              title={`Product ${field.name + 1}`}
                              key={field.key}
                              extra={
                                <SquareX
                                  className="cursor-pointer"
                                  onClick={() => {
                                    remove(field.name)
                                  }}
                                />
                              }
                            >
                              <Form.Item required={false} key={field.key}>
                                <Form.Item
                                  className="col-span-12"
                                  label="Combo product"
                                  name={[field.name, 'productId']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please choose product product!'
                                    }
                                  ]}
                                >
                                  <Select
                                    labelInValue
                                    loading={isLoadingProductPublic}
                                    showSearch
                                    filterOption={false}
                                    onSearch={setSearchProduct}
                                    options={optionsProductPublic?.map(item => ({
                                      productId: item._id,
                                      label: item.name,
                                      value: item._id
                                    }))}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Quantity"
                                  name={[field.name, 'quantity']}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please input quantity.'
                                    }
                                  ]}
                                >
                                  <Input />
                                </Form.Item>
                              </Form.Item>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </Form.List>
                </div>
              )}
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

export default ProductForm
