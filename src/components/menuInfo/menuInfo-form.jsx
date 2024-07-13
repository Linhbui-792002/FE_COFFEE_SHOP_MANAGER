import { Button, Form, Input, Modal, Spin } from 'antd'
import { Pencil, UserRoundPlus } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'
import Notification from '../common/notification'
import {
  useCreateMenuInfoMutation,
  useGetOneMenuInfoQuery,
  useUpdateMenuInfoMutation
} from '@src/redux/endPoint/menuInfo'

const MenuInfoForm = ({ label, menuInfoId, title, type, useSubComponent, getMenuInfoIdFn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: dataMenuInfo, isLoading: isLoadingMenuInfo } = useGetOneMenuInfoQuery(menuInfoId, {
    skip: !menuInfoId || !isModalOpen
  })
  const [createNewMenuInfo, { isLoading: isLoadingCreateMenuInfo }] = useCreateMenuInfoMutation()
  const [updateNewMenuInfo, { isLoading: isLoadingUpdateMenuInfo }] = useUpdateMenuInfoMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ ...dataMenuInfo })
  }, [dataMenuInfo])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddMenuInfo = async body => {
    try {
      const res = await createNewMenuInfo(body).unwrap()
      if (useSubComponent) {
        getMenuInfoIdFn(res?.metadata?._id)
      }
      Notification('success', 'Menu Info Manager', 'Create menu info successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Menu Info Manager', error?.data?.message)
        default:
          return Notification('error', 'Menu Info Manager', 'Failed call api')
      }
    }
  }

  const handleEditMenuInfo = async body => {
    try {
      await updateNewMenuInfo({ ...body, menuInfoId }).unwrap()
      Notification('success', 'Account Manager', 'Edit account successfully')
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Menu Info Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Account Manager', error?.data?.message)
        default:
          return Notification('error', 'Account Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    if (menuInfoId) {
      handleEditMenuInfo(values)
    } else {
      handleAddMenuInfo(values)
    }
  }
  return (
    <Spin spinning={isLoadingMenuInfo}>
      <Button
        type={type}
        icon={menuInfoId ? <Pencil className="m-auto text-t-blue" /> : <UserRoundPlus size={18} />}
        shape={menuInfoId ? 'circle' : 'default'}
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
        width={400}
        onCancel={handleCancel}
        okButtonProps={{ loading: isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo }}
        cancelButtonProps={{ disabled: isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo }}
        centered
      >
        <Spin spinning={false}>
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            disabled={isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo}
            form={form}
          >
            <Form.Item
              label="Name menu infoasdas"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your menu info name!'
                }
              ]}
            >
              <Input />
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

export default MenuInfoForm
