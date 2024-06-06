import {
  useAddSalaryMutation,
  useEditSalaryMutation,
  useGetAllEmployeeQuery,
  useGetInfoSalaryQuery
} from '@src/redux/endPoint/salary'
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Spin } from 'antd'
import { FilePenLine, Pencil, UserPlus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Notification from '../common/notification'

const SalaryForm = ({ salaryId, title }) => {
  //declare modal:
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingListEmployee, setIsLoadingListEmployee] = useState(false)
  const formRef = useRef(null)
  const [form] = Form.useForm()
  const [totalSalary, setTotalSalary] = useState(0)

  //declare api:
  const [addSalary, isLoading] = useAddSalaryMutation()
  const [editSalary, isLoadingEdit] = useEditSalaryMutation()

  //handle close form:
  const handleCloseModal = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  //Get all employee has account:
  const { data: employeeData, isLoading: isLoadingEmployeeData } = useGetAllEmployeeQuery()

  //Get all employee has account:
  if (salaryId != null && isModalOpen) {
    const { data: salaryInfo, isLoading: isLoadingSalaryData, refetch } = useGetInfoSalaryQuery(salaryId)

    useEffect(() => {
      form.setFieldsValue({
        employeeId: salaryInfo?.employeeId?._id,
        bonus: salaryInfo?.bonus,
        workTerm: salaryInfo?.workTerm,
        hardSalary: salaryInfo?.hardSalary,
        bonusPercent: salaryInfo?.bonusPercent
      }),
        [salaryInfo]
    })
  }

  //filter Employee
  const [searchEmployee, setSearchEmployee] = useState('')

  //get hardSalary:
  const [salary, setHardSalary] = useState('')
  const handleEmployee = Form.useWatch('employeeId', form)
  useEffect(() => {
    const hardSalary = employeeData?.find(item => item?._id == handleEmployee)?.hardSalary
    form.setFieldValue(
      'totalSalary',
      hanldeTotalSalary(
        Number(hardSalary),
        Number(form.getFieldValue('bonus')),
        Number(form.getFieldValue('deduction'))
      )
    )
    form.setFieldValue('hardSalary', hardSalary)
  }, [handleEmployee])

  //get bonus:
  const handleBonusPercent = Form.useWatch('bonusPercent', form)
  useEffect(() => {
    const bonusPercent = handleBonusPercent ? handleBonusPercent : 0
    const totalBonus = (form.getFieldValue('hardSalary') * bonusPercent) / 100
    form.setFieldValue(
      'totalSalary',
      hanldeTotalSalary(
        Number(form.getFieldValue('hardSalary')),
        Number(totalBonus),
        Number(form.getFieldValue('deduction'))
      )
    )
    form.setFieldValue('bonus', totalBonus || 0)
  }, [handleBonusPercent])

  //handle last day of month:
  const [maxDayOff, setMaxDayOff] = useState(0)
  const handleWorkTerm = Form.useWatch('workTerm', form)
  useEffect(() => {
    const month = handleWorkTerm ? handleWorkTerm.$d : new Date()
    setMaxDayOff(new Date(month?.getFullYear(), month?.getMonth() + 1, 0).getDate())
  }, [handleWorkTerm])

  //handle Deduction:
  const handleDeduction = Form.useWatch('deduction', form)
  useEffect(() => {
    const deduction = handleDeduction ? handleDeduction : 0
    form.setFieldValue(
      'totalSalary',
      hanldeTotalSalary(
        Number(form.getFieldValue('hardSalary')),
        Number(form.getFieldValue('bonus')),
        Number(deduction)
      )
    )
  }, [handleDeduction])

  //handle Total Salary:
  const hanldeTotalSalary = (hardSalary, bonusPercent, deduction) => {
    return (hardSalary || 0) + (bonusPercent || 0) - (deduction || 0)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onFinish = async () => {
    const dataForm = form.getFieldsValue()
    const getDate = dataForm.workTerm ? new Date(dataForm.workTerm) : null
    const monthTerm = dataForm.workTerm ? getDate.getFullYear() + ' - ' + (getDate.getMonth() + 1) : null
    const payload = {
      employeeId: dataForm.employeeId,
      workTerm: salaryId ? dataForm.workTerm : monthTerm,
      dateOff: dataForm.dateOff || 0,
      deduction: dataForm.deduction || 0,
      bonusPercent: dataForm.bonusPercent || 0,
      bonus: dataForm.bonus || 0,
      hardSalary: dataForm.hardSalary || 0,
      totalSalary: dataForm.totalSalary || 0
    }
    try {
      if (!salaryId) {
        await addSalary(payload).unwrap()
        Notification('success', 'Create Salary', 'Create Salary successfully')
      } else {
        await editSalary({ ...payload, _id: salaryId }).unwrap()
        Notification('success', 'Edit Salary', 'Edit Salary successfully')
      }
      handleCloseModal()
    } catch (error) {
      console.error(error)
      Notification('error', 'Create Salary Fail', error?.data?.message)
    }
  }

  return (
    <Spin spinning={isLoadingEmployeeData}>
      <Button
        icon={salaryId ? <FilePenLine /> : <UserPlus size={18} />}
        onClick={showModal}
        className="flex items-center w-max"
      >
        {title}
      </Button>
      <Modal
        onOk={onFinish}
        title={title}
        open={isModalOpen}
        onCancel={handleCloseModal}
        //  onOk={handleOk}
        okText="Submit"
        //  onCancel={handleCancel}
        //  okButtonProps={{ loading: isLoading || isLoadingAccountData }}
        //  cancelButtonProps={{ disabled: isLoading || isLoadingAccountData }}
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
                loading={isLoadingListEmployee}
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

export default SalaryForm
