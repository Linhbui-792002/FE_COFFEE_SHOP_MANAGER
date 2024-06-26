import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Upload, message, Image, Spin } from 'antd'
import UploadImage from '../common/uploadImage'
import { useGetGeneralQuery, useUpdateGeneralMutation } from '@src/redux/endPoint/general'
import Notification from '../common/notification'

const GeneralForm = () => {
  const [form] = Form.useForm()
  const { data: generalInfo, isLoading: isLoadingGeneral } = useGetGeneralQuery()
  const [updateGeneral, { isLoading }] = useUpdateGeneralMutation()

  const handleAddGeneral = async body => {
    try {
      await updateGeneral(body).unwrap()
      Notification('success', 'General Manage', 'General info has been updated successfully')
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'General Manage', error?.data?.message)
        default:
          return Notification('error', 'General Manage', 'Failed call api')
      }
    }
  }

  const handleUpdateGeneral = async body => {
    try {
      await updateGeneral({ ...body, generalId: generalInfo._id }).unwrap()
      Notification('success', 'General Manage', 'General info has been updated successfully')
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'General Manage', error?.data?.message)
        default:
          return Notification('error', 'General Manage', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    const generalId = form.getFieldValue('generalId')
    if (generalId) {
      handleUpdateGeneral(values)
    } else {
      handleAddGeneral(values)
    }
  }

  const onFinishFailed = errorInfo => {
    Notification('error', 'General Manage', 'Form submission failed')
  }

  const getImageLogo = data => {
    form.setFieldValue('logo', data)
  }

  const getImageFavicon = data => {
    form.setFieldValue('favicon', data)
  }

  useEffect(() => {
    if (generalInfo) {
      form.setFieldsValue({
        email: generalInfo.email,
        name: generalInfo.name,
        phone: generalInfo.phone,
        address: generalInfo.address,
        logo: generalInfo.logo,
        favicon: generalInfo.favicon,
        generalId: generalInfo._id
      })
    }
  }, [generalInfo])

  return (
    <Spin spinning={isLoadingGeneral}>
      <div className="w-[50%]">
        <Form layout="vertical" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
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

          <Form.Item hidden name="generalId">
            <Input hidden />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name of web!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Logo" name="logo" valuePropName="fileList">
            <UploadImage getDataFn={getImageLogo} setData={form.getFieldValue('logo')} />
          </Form.Item>
          <Form.Item label="Favicon" name="favicon" valuePropName="fileList">
            <UploadImage getDataFn={getImageFavicon} setData={form.getFieldValue('favicon')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-max">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  )
}

export default GeneralForm
