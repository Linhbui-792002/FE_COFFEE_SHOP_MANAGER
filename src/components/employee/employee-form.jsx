import { useEditAccountMutation, useGetListAccountNotEmployeeQuery } from '@src/redux/endPoint/account'
import { Button, Form, Input, Modal, Spin, Select, Switch, DatePicker, Radio, InputNumber, Divider, Tag } from 'antd'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import Notification from '../common/notification'
import { Pencil, UserRoundPlus } from 'lucide-react'
import TooltipCustom from '../common/tooltip'
import AccountForm from '../account/account-form'
import { useAddEmployeeMutation, useEditEmployeeMutation, useGetInfoEmployeeQuery } from '@src/redux/endPoint/employee'
import dayjs from 'dayjs'

const EmployeeForm = ({ label, employeeId, title, type, useSubComponent, getEmployeeIdFn }) => {
  const [searchAccount, setSearchAccount] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accountIdAddNew, setAccountIdAddNew] = useState()
  const {
    data: employeeData,
    isLoading: isLoadingEmployeeData,
    refetch
  } = useGetInfoEmployeeQuery(employeeId, { skip: !employeeId })
  const {
    data: listAccount,
    isLoading: isLoadingListAccount,
    refetch: refetchListAccount
  } = useGetListAccountNotEmployeeQuery(employeeId)

  const [addEmployee, { isLoading }] = useAddEmployeeMutation()
  const [editEmployee, { isLoading: isLoadingUpdate }] = useEditEmployeeMutation()
  const [editAccount, { isLoading: isLoadingEditAccount, isSuccess: isSuccessEditAccount }] = useEditAccountMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()
  useEffect(() => {
    if (employeeId) {
      refetch()
      refetchListAccount()
    }
  }, [employeeId])

  useEffect(() => {
    if (isModalOpen || employeeId) {
      refetchListAccount()
    }
  }, [isModalOpen, employeeId])
  useEffect(() => {
    const accountId =
      listAccount?.length != 0 && listAccount?.find(account => account?.employeeId === employeeData?._id)?._id
    form.setFieldsValue({ ...employeeData, dob: dayjs(employeeData?.dob), accountId: accountId })
  }, [employeeData, listAccount])

  useEffect(() => {
    if (accountIdAddNew) {
      form.setFieldValue('accountId', accountIdAddNew)
    }
  }, [accountIdAddNew, listAccount])

  const filteredAccount = useMemo(() => {
    return listAccount?.filter(account => account?.username?.toLowerCase().includes(searchAccount?.toLowerCase()))
  }, [searchAccount, listAccount, isLoadingListAccount])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const getAccountIdAddNew = accountId => {
    setAccountIdAddNew(accountId)
  }

  const handleEditAccount = async body => {
    try {
      await editAccount(body).unwrap()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Account Manager', error?.data?.message)
        default:
          return Notification('error', 'Account Manager', 'Failed call api')
      }
    }
  }

  const handleAddEmployee = async body => {
    try {
      const res = await addEmployee(body).unwrap()
      const payloadUpdateAccount = {
        accountId: body?.accountId,
        employeeId: res?.metadata?._id
      }
      if (useSubComponent) {
        getEmployeeIdFn(res?.metadata?._id)
      }
      body?.accountId && (await handleEditAccount(payloadUpdateAccount))
      Notification('success', 'Employee Manager', 'Create employee successfully')
      form.resetFields()
      setAccountIdAddNew('')
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Employee Manager', error?.data?.message)
        default:
          return Notification('error', 'Employee Manager', 'Failed call api')
      }
    }
  }

  const handleEditEmployee = async body => {
    try {
      const payloadUpdateAccount = {
        accountId: body?.accountId,
        employeeId: employeeId
      }
      const accountId =
        listAccount.length != 0 && listAccount.find(account => account?.employeeId === employeeData?._id)?._id
      if (!body?.accountId || (accountId && accountId != body?.accountId)) {
        await handleEditAccount({ accountId, employeeId: null })
      } else if (body?.accountId) {
        await handleEditAccount(payloadUpdateAccount)
      }
      await editEmployee({ ...body, employeeId }).unwrap()
      setAccountIdAddNew('')
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
    if (employeeId) {
      handleEditEmployee(values)
    } else {
      handleAddEmployee(values)
    }
  }
  return (
    <Spin spinning={isLoadingListAccount || isLoadingEmployeeData}>
      <Button
        type={type}
        icon={employeeId ? <Pencil className="m-auto text-t-blue" /> : <UserRoundPlus size={18} />}
        shape={employeeId ? 'circle' : 'default'}
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
        width={600}
        okButtonProps={{ loading: isLoading || isLoadingListAccount }}
        cancelButtonProps={{ disabled: isLoading || isLoadingListAccount }}
        centered
      >
        <Spin spinning={false}>
          <Form layout="vertical" ref={formRef} onFinish={onFinish} autoComplete="off" disabled={isLoading} form={form}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your first name!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your last name!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Phone number"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your phone number!'
                    },
                    {
                      validator: (_, value) => {
                        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
                        if (value && !phoneRegex.test(value)) {
                          return Promise.reject('Please input a valid phone number!')
                        }
                        return Promise.resolve()
                      }
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your address!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Hard Salary"
                  name="hardSalary"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your phone number!'
                    }
                  ]}
                >
                  <InputNumber className="w-full" suffix="VNĐ" />
                </Form.Item>
              </div>
              <div className="col-span-6">
                <Form.Item
                  label="Day of birth"
                  name="dob"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your day of birth!'
                    }
                  ]}
                >
                  <DatePicker format={'DD/MM/YYYY'} />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your gender!'
                    }
                  ]}
                >
                  <Radio.Group>
                    <Radio value={false}> Male </Radio>
                    <Radio value={true}> Female </Radio>
                  </Radio.Group>
                </Form.Item>
                {!useSubComponent && <Form.Item className="w-full" label="Choose Account" name="accountId">
                  <Select
                    loading={isLoadingListAccount}
                    showSearch
                    filterOption={false}
                    onSearch={setSearchAccount}
                    mode="single"
                    allowClear
                    dropdownRender={menu => (
                      <>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center justify-between gap-2">
                            Add new account
                            <TooltipCustom title="Add new account" color="blue">
                              <AccountForm getAccountIdFn={getAccountIdAddNew} useSubComponent={true} />
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
                    {filteredAccount?.map(item => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.username}
                        <Tag color={item?.role == 'Employee' ? 'blue' : 'gold'} className="w-max !m-0 !ml-3">
                          {item.role}
                        </Tag>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                }
                <Form.Item label="Status doing" name="status" initialValue={useSubComponent ?? false}>
                  <Switch defaultValue={useSubComponent ?? false} disabled={useSubComponent} />
                </Form.Item>
              </div>
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

export default EmployeeForm
