import { ROLES } from '@src/constants'
import { useAddAccountMutation, useEditAccountMutation, useGetInfoAccountQuery } from '@src/redux/endPoint/account'
import { useGetEmployeesHasNotAccountQuery } from '@src/redux/endPoint/employee'
import { Button, Divider, Form, Input, Modal, Select, Spin, Switch, Tooltip } from 'antd'
import { Pencil, UserPlus } from 'lucide-react'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import Notification from '../common/notification'
import TooltipCustom from '../common/tooltip'

const AccountForm = ({ label, accountId, title, type }) => {
  const [searchEmployee, setSearchEmployee] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    data: accountData,
    isLoading: isLoadingAccountData,
    refetch
  } = useGetInfoAccountQuery(accountId, { skip: !accountId })
  const {
    data: listEmployee,
    isLoading: isLoadingListEmployee,
    refetch: refetchListEmployee
  } = useGetEmployeesHasNotAccountQuery(accountId)
  const [addAccount, { isLoading }] = useAddAccountMutation()
  const [editAccount, { isLoading: isEditLoading }] = useEditAccountMutation()
  const formRef = useRef(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (accountId) {
      refetch()
      refetchListEmployee()
    }
  }, [accountId])

  useEffect(() => {
    if (isModalOpen) {
      refetchListEmployee()
    }
  }, [isModalOpen])
  useEffect(() => {
    form.setFieldsValue(accountData)
  }, [accountData])

  const filteredEmployee = useMemo(() => {
    return listEmployee?.filter(employee =>
      `${employee?.firstName} ${employee?.lastName}`.toLowerCase().includes(searchEmployee.toLowerCase())
    )
  }, [searchEmployee, listEmployee, isLoadingListEmployee])
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddAccount = async body => {
    try {
      await addAccount(body).unwrap()
      Notification('success', 'Account Manager', 'Create account successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Account Manager', error?.data?.message)
        default:
          return Notification('error', 'Account Manager', 'Failed call api')
      }
    }
  }

  const handleEditAccount = async body => {
    try {
      await editAccount({ ...body, accountId }).unwrap()
      Notification('success', 'Account Manager', 'Edit account successfully')
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Account Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Account Manager', error?.data?.message)
        default:
          return Notification('error', 'Account Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    if (accountId) {
      handleEditAccount(values)
    } else {
      handleAddAccount(values)
    }
  }

  return (
    <Spin spinning={isLoadingListEmployee || isLoadingAccountData}>
      <Button
        type={type}
        icon={accountId ? <Pencil className="m-auto text-t-blue" /> : <UserPlus size={18} />}
        shape={accountId ? 'circle' : 'default'}
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
        okButtonProps={{ loading: isLoading || isLoadingAccountData }}
        cancelButtonProps={{ disabled: isLoading || isLoadingAccountData }}
        centered
      >
        <Spin spinning={isLoadingListEmployee}>
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
                  message: 'Please input your username!'
                }
              ]}
            >
              <Input disabled={accountId} />
            </Form.Item>
            {!accountId && (
              <>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input password!'
                    }
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
                      message: 'Please confirm your password!'
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'))
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="Confirm password" />
                </Form.Item>
              </>
            )}
            <div className="flex gap-5">
              <Form.Item
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
              </Form.Item>
              {!accountId && (
                <Form.Item label="Block" name="status" initialValue={false}>
                  <Switch defaultValue={false} />
                </Form.Item>
              )}
              <Form.Item className="w-full" label="Choose Employee" name="employeeId">
                <Select
                  loading={isLoadingListEmployee}
                  showSearch
                  filterOption={false}
                  onSearch={setSearchEmployee}
                  mode="single"
                  allowClear
                  dropdownRender={menu => (
                    <>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center justify-between gap-2">
                          Add new employee
                          <TooltipCustom title="Add new employee" color="blue">
                            <AccountForm />
                          </TooltipCustom>
                        </div>
                        <Divider
                          style={{
                            margin: '8px 0'
                          }}
                        />
                      </div>
                      {menu}
                    </>
                  )}
                >
                  {filteredEmployee?.map(item => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {`${item?.firstName} ${item?.lastName}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
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

export default AccountForm
