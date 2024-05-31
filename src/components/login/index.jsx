import React, { useEffect } from 'react'
import CustomImage from '../common/custom-image'
import Logo from '~public/images/logo.png'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography } from 'antd'
import { useLoginMutation } from '@src/redux/endPoint/auth'
import Notification from '../common/notification'
import { useRouter } from 'next/router'
const Login = () => {
  const router = useRouter()
  const [login, { isLoading, isError, error }] = useLoginMutation()

  const onFinish = async payload => {
    try {
      const res = await login(payload)

      if (res?.data?.status === 200) {
        Notification('success', 'Login', 'Login successfully')
        router.replace('/')
      } else if (res?.error?.status === 409) {
        Notification('error', 'Login', res?.error?.data?.message)
      } else if (isError) {
        console.log(error, 'error')
        Notification('error', 'Login', 'Failed call api')
      }
    } catch (error) {
      console.log(error, 'error')
      Notification('error', 'Login', 'Failed call api')
    }
  }

  return (
    <div className="grid grid-cols-12 h-[100vh]">
      <div className="col-span-8 flex items-center justify-center background-login">
        <CustomImage src={Logo.src} width={500} height={200} />
      </div>
      <div className="col-span-4 flex flex-col items-center justify-center bg-b-white">
        <Typography.Title className="!text-t-brown text-lg font-sans">Login Account</Typography.Title>
        <Form name="basic" onFinish={onFinish} layout="vertical" className="flex flex-col justify-center !w-[20rem]">
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-b-button !rounded-lg hover:!bg-b-primary-to"
              loading={isLoading}
              iconPosition="start"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
