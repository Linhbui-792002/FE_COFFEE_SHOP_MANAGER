import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Upload, message } from 'antd'

const normFile = e => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const FormDisabledDemo = () => {
  const [form] = Form.useForm()

  const onFinish = values => {
    console.log('Form values:', values)
    message.success('Form submitted successfully')
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
    message.error('Form submission failed')
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <div>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name of web!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Logo"
          name="logo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload your company logo"
        >
          <Upload action="/upload.do" listType="picture-card">
            <Button style={{ border: 0, background: 'none' }} icon={<PlusOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>
      </div>

      <div>
        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Favico"
          name="logo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload your company logo"
        >
          <Upload action="/upload.do" listType="picture-card">
            <Button style={{ border: 0, background: 'none' }} icon={<PlusOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormDisabledDemo
