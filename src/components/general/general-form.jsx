import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Upload, message } from 'antd'

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
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: '100%' }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name of web!' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Logo"
            name="logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your company logo"
            wrapperCol={{ span: 24 }}
          >
            <Upload action="/upload.do" listType="picture-card">
              <Button style={{ border: 0, background: 'none' }} icon={<PlusOutlined />}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Favico"
            name="favico"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your company logo"
            wrapperCol={{ span: 24 }}
          >
            <Upload action="/upload.do" listType="picture-card">
              <Button style={{ border: 0, background: 'none' }} icon={<PlusOutlined />}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormDisabledDemo
