import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Upload, message, Image } from 'antd'
const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const normFile = e => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const GeneralForm = () => {
  const [form] = Form.useForm()

  const onFinish = values => {
    console.log('Form values:', values)
    message.success('Form submitted successfully')
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
    message.error('Form submission failed')
  }

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: '/images/background-1.png'
    }
  ])
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  )

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

          {/* set default or value for uplodad with public/images/background-1.png */}
          <Form.Item
            label="Logo"
            name="logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your company logo"
            wrapperCol={{ span: 24 }}
          >
            <Upload
              // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: 'none'
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: visible => setPreviewOpen(visible),
                  afterOpenChange: visible => !visible && setPreviewImage('')
                }}
                src={previewImage}
              />
            )}
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
            <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" listType="picture-card">
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

export default GeneralForm
