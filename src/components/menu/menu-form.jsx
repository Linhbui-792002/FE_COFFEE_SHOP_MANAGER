import { Button, Form, Input, Modal, Spin } from 'antd'
import { Pencil, UserRoundPlus } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'
import Notification from '../common/notification'
import { useCreateMenuMutation, useGetOneMenuQuery, useUpdateMenuMutation } from '@src/redux/endPoint/menu'

const MenuForm = ({ label, menuId, title, type, useSubComponent, getMenuIdFn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: dataMenu, isLoading: isLoadingMenu } = useGetOneMenuQuery(menuId, {
    skip: !menuId || !isModalOpen
  })
  const [createNewMenu, { isLoading: isLoadingCreateMenu }] = useCreateMenuMutation()
  const [updateNewMenu, { isLoading: isLoadingUpdateMenu }] = useUpdateMenuMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ ...dataMenu })
  }, [dataMenu])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddMenu = async body => {
    try {
      const res = await createNewMenu(body).unwrap()
      if (useSubComponent) {
        getMenuIdFn(res?.metadata?._id)
      }
      Notification('success', 'Menu Manager', 'Create menu successfully')
      form.resetFields()
      handleCancel()
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
  return (
    <Spin spinning={isLoadingMenu}>
      <Button
        type={type}
        icon={menuId ? <Pencil className="m-auto text-t-blue" /> : <UserRoundPlus size={18} />}
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
        width={400}
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
            {/* <Form.Item
              className="w-full"
              label="Choose Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please choose role!'
                }
              ]}
              initialValue={ROLES.EMPLOYEE}
            >
              <Select defaultValue={ROLES.EMPLOYEE}>
                {Object.keys(ROLES)?.map(key => (
                  <Select.Option key={key} value={ROLES[key]}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
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
