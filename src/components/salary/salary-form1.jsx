import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Spin } from 'antd'
import { Pencil, UserRoundPlus } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'
import Notification from '../common/notification'
import { useAddSalaryMutation, useEditSalaryMutation, useGetInfoSalaryQuery } from '@src/redux/endPoint/salary'
import { useGetAllEmployeeQuery } from '@src/redux/endPoint/employee'

const SalaryForm1 = ({ label, salaryId, title, type, useSubComponent, getSalaryInfoIdFn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: employeeData, isLoading: isLoadingEmployeeData } = useGetAllEmployeeQuery()
  const { data: dataSalaryInfo, isLoading: isLoadingSalaryInfo } = useGetInfoSalaryQuery(salaryId, {
    skip: !salaryId || !isModalOpen
  })
  const [createNewSalaryInfo, { isLoading: isLoadingCreateSalaryInfo }] = useAddSalaryMutation()
  const [updateNewSalaryInfo, { isLoading: isLoadingUpdateSalaryInfo }] = useEditSalaryMutation()

  const formRef = useRef(null)
  const [form] = Form.useForm()

  //filter Employee
  const [searchEmployee, setSearchEmployee] = useState('')
  const [totalSalary, setTotalSalary] = useState(0)
  const [maxDayOff, setMaxDayOff] = useState(0)

  // chưa xư í
  const hanldeTotalSalary = (hardSalary, bonusPercent, deduction) => {
    return (hardSalary || 0) + (bonusPercent || 0) - (deduction || 0)
  }
  //

  useEffect(() => {
    form.setFieldsValue({ ...dataSalaryInfo })
  }, [dataSalaryInfo])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    formRef.current?.submit()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleAddSalaryInfo = async body => {
    try {
      const res = await createNewSalaryInfo(body).unwrap()
      if (useSubComponent) {
        getSalaryInfoIdFn(res?.metadata?._id)
      }
      Notification('success', 'Salary Info Manager', 'Create salary info successfully')
      form.resetFields()
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 409:
          return Notification('error', 'Salary Info Manager', error?.data?.message)
        default:
          return Notification('error', 'Salary Info Manager', 'Failed call api')
      }
    }
  }

  const handleEditSalaryInfo = async body => {
    try {
      await updateNewSalaryInfo({ ...body, salaryId }).unwrap()
      Notification('success', 'Salary Manager', 'Edit account successfully')
      handleCancel()
    } catch (error) {
      switch (error?.status) {
        case 400:
          return Notification('error', 'Salary Info Manager', error?.data?.message)
        case 409:
          return Notification('error', 'Salary Manager', error?.data?.message)
        default:
          return Notification('error', 'Salary Manager', 'Failed call api')
      }
    }
  }

  const onFinish = values => {
    if (salaryId) {
      handleEditSalaryInfo(values)
    } else {
      handleAddSalaryInfo(values)
    }
  }
  return (
    <Spin spinning={isLoadingSalaryInfo}>
      <Button
        type={type}
        icon={salaryId ? <Pencil className="m-auto text-t-blue" /> : <UserRoundPlus size={18} />}
        shape={salaryId ? 'circle' : 'default'}
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
        width={600}
        onCancel={handleCancel}
        okButtonProps={{ loading: isLoadingCreateSalaryInfo || isLoadingUpdateSalaryInfo }}
        cancelButtonProps={{ disabled: isLoadingCreateSalaryInfo || isLoadingUpdateSalaryInfo }}
        centered
      >
        <Spin spinning={false}>
          <Form
            name="basic"
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            autoComplete="off"
            // disabled={isLoading}
            form={form}
            initialValues={{
              hard: employeeData?.hardSalary
            }}
          >
            <Form.Item
              label="Employee"
              name="employeeId"
              rules={[
                {
                  required: true,
                  message: 'Please select employee to create salary!'
                }
              ]}
            >
              <Select
                loading={isLoadingEmployeeData}
                showSearch
                filterOption={false}
                onSearch={setSearchEmployee}
                disabled={salaryId ? true : false}
                mode="single"
                allowClear
              >
                {employeeData?.map(item => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {`${item?.firstName} ${item?.lastName}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Work Term"
              name="workTerm"
              rules={[
                {
                  required: true,
                  message: 'Please select work term to create salary!'
                }
              ]}
            >
              {salaryId ? <Input readOnly /> : <DatePicker className="w-full" picker="month"></DatePicker>}
            </Form.Item>

            <Form.Item label="Hard Salary" name="hardSalary">
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="Bonus Percent"
              name="bonusPercent"
              rules={[
                {
                  required: true,
                  message: 'Please fill bonus percent!'
                }
              ]}
            >
              <InputNumber className="w-full" min={0} defaultValue={0} addonAfter="%" />
            </Form.Item>

            <Form.Item label="Bonus" name="bonus">
              <Input defaultValue={0} readOnly />
            </Form.Item>

            <Form.Item label="Date Off" name="dateOff">
              <InputNumber className="w-full" min={0} max={maxDayOff} defaultValue={0} addonAfter="days" />
            </Form.Item>

            <Form.Item
              label="Deduction"
              name="deduction"
              rules={[
                {
                  required: true,
                  message: 'Please fill deduction!'
                }
              ]}
            >
              <InputNumber className="w-full" min={0} defaultValue={0} />
            </Form.Item>

            <Form.Item label="Total Salary" name="totalSalary">
              <InputNumber className="w-full" min={0} defaultValue={totalSalary} readOnly />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Spin>
  )
}

export default SalaryForm1
