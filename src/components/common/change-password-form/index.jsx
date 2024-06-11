import { useChangePasswordMutation } from '@src/redux/endPoint/auth'
import { Button, Form, Input, Modal, Spin } from 'antd'
import React, { useRef, useState } from 'react'
import Notification from '../notification'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const ChangePassword = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [changePassword] = useChangePasswordMutation()
  const formRef = useRef(null)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleChangePassword = async body => {
    try {
      await changePassword(body).unwrap()
      Notification('success', 'Change Password', 'Change password successfully')
      handleCancel()
      Cookies.remove('accessToken')
      router.replace('/')
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Change Password', error?.data?.message)
        default:
          return Notification('error', 'Change Password', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    handleChangePassword(values)
  }
  return (
    <Spin spinning={false}>
      <p onClick={showModal}>Change password</p>
      <Modal
        title="Change Password"
        open={isModalOpen}
        onOk={handleOk}
        okText="Submit"
        width={400}
        onCancel={handleCancel}
        // okButtonProps={{ loading: isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo }}
        // cancelButtonProps={{ disabled: isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo }}
        centered
      >
        <Spin spinning={false}>
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            // disabled={isLoadingCreateMenuInfo || isLoadingUpdateMenuInfo}
            form={form}
          >
            <Form.Item
              label="Old Password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input old password!'
                }
              ]}
            >
              <Input.Password placeholder="Input old password" />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input new password!'
                }
              ]}
            >
              <Input.Password placeholder="Input new password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                  }
                })
              ]}
            >
              <Input.Password placeholder="Confirm password" />
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

export default ChangePassword
