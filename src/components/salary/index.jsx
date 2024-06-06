import React, { useEffect, useState } from 'react'
import { Breadcrumb, Space, Spin, Table, Tag } from 'antd'
import Link from 'next/link'
import { Home, Receipt } from 'lucide-react'
import TooltipCustom from '../common/tooltip'
import { useGetAllSalariesQuery } from '@src/redux/endPoint/salary'
import SalaryForm from './salary-form'
import SalaryForm1 from './salary-form1'

const Salary = () => {
  //declare useGetAllSalariesQuery:
  const { data, isLoading } = useGetAllSalariesQuery()

  //filter Employee:
  const [employeeSet, setEmployeeSet] = useState(new Set())
  const [filterEmployeeOption, setFilterEmployeeOption] = useState([])

  //filter WorkTerm:
  const [workTermSet, setWorkTermSet] = useState(new Set())
  const [filterWorkTerm, setFilterWorkTerm] = useState([])

  useEffect(() => {
    if (data) {
      employeeSet.clear()
      workTermSet.clear()
      data.forEach(item => {
        const name = `${item.employeeId.lastName} ${item.employeeId.firstName}`
        if (!employeeSet.has(name)) {
          employeeSet.add(name)
        }
        if (!workTermSet.has(item.workTerm)) {
          workTermSet.add(item.workTerm)
        }
      })
      setFilterEmployeeOption([...employeeSet])
      setFilterWorkTerm([...workTermSet])
    } else {
      setFilterEmployeeOption([])
      setFilterWorkTerm([])
    }
  }, [data])

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeId',
      key: 'employeeId.id',
      render: employeeId => `${employeeId.lastName} ${employeeId.firstName}`,
      filters: filterEmployeeOption.map(item => ({
        text: `${item}`,
        value: `${item}`
      })),
      onFilter: (value, record) => `${record.employeeId.lastName} ${record.employeeId.firstName}` === value
    },
    {
      title: 'Work Terms',
      dataIndex: 'workTerm',
      key: 'workTerm',
      filters: filterWorkTerm.map(item => ({
        text: `${item}`,
        value: `${item}`
      })),
      onFilter: (value, record) => `${record.workTerm}` === value
    },
    {
      title: 'Hard Salary',
      dataIndex: 'hardSalary',
      key: 'hardSalary',
      sorter: (a, b) => a.hardSalary - b.hardSalary,
      ellipsis: true
    },
    {
      title: 'Bonus Percentage',
      dataIndex: 'bonusPercent',
      key: 'bonusPercent',
      sorter: (a, b) => a.bonusPercent - b.bonusPercent,
      ellipsis: true
    },
    {
      title: 'Bonus',
      dataIndex: 'bonus',
      key: 'bonus',
      sorter: (a, b) => a.bonus - b.bonus,
      ellipsis: true
    },
    {
      title: 'Deduction',
      dataIndex: 'deduction',
      key: 'deduction',
      sorter: (a, b) => a.deduction - b.deduction,
      ellipsis: true
    },
    {
      title: 'Total Salary',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      sorter: (a, b) => a.totalSalary - b.totalSalary,
      ellipsis: true
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <TooltipCustom title="Edit salary" key="edit" color="blue">
            <SalaryForm title="Edit" salaryId={record._id} />
          </TooltipCustom>
        </Space>
      )
    }
  ]

  return (
    <Spin spinning={isLoading}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" className="!flex gap-1 items-center w-max">
                {' '}
                <Home size={18} /> Home
              </Link>
            )
          },
          {
            title: (
              <span className="!flex gap-1 items-center w-max">
                <Receipt size={18} /> Salary
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Salary Manager</h1>
          <SalaryForm title="Add new salary" label="New Salary" />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table pagination={{ pageSize: 5 }} dataSource={data} columns={columns} />
        </div>
      </div>
    </Spin>
  )
}

export default Salary
