import { ROLES } from '@src/constants';
import { Button, Form, Input, Modal, Select, Spin } from 'antd'
import { Pencil, UserPlus } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'

const AccountForm = ({ label, accountId, title }) => {

  const formRef = useRef(null);
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isModalOpen) {
      // reload();
    }
  }, [isModalOpen]);

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formRef.current?.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const onFinish = (values) => {
    console.log(values, 'values')
    // if (ticketId) {
    //     trigger('PUT', `eventTikets/${ticketId}`, { ...values, event_id });
    // } else {
    //     trigger('POST', 'eventTikets', { ...values, event_id });
    // }
  };

  return (
    <>
      <Button
        icon={accountId ? <Pencil size={18} /> : <UserPlus size={18} />}
        shape={accountId ? 'circle' : 'default'}
        onClick={showModal}
        className='flex items-center w-max'
      >
        {label}
      </Button>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        // okButtonProps={{ loading: isLoading || getLoading }}
        // cancelButtonProps={{ disabled: isLoading || getLoading }}
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
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input password!',
                },
              ]}
            >
              <Input.Password placeholder="Input password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue('password') === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
            <Form.Item
              className="w-40"
              label="Choose Role"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Please choose role!',
                },
              ]}
            >
              <Select>
                {Object.keys(ROLES)?.map((item) => (
                  <Select.Option
                    key={item?.key}
                    value={item?.value}
                  >
                    {item?.key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item hidden>
              <Button type="primary" htmlType="submit">
                Add New
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default AccountForm
