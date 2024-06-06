import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Spin, Table } from 'antd'
import SalaryForm from './salary-form'
import { useGetAllSalariesQuery } from '@src/redux/endPoint/salary'

const SalaryApp = () => {
  const [sortedInfo, setSortedInfo] = useState({})

  //declare useGetAllSalariesQuery:
  const { data, isSuccess, isError, error } = useGetAllSalariesQuery()

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
      render: record => <SalaryForm title="Edit" salaryId={record._id} />
    }
  ]
  return (
    <>
      <Card
        className="relative custom-card-salary"
        style={{ maxHeight: '53rem', overflow: 'auto', paddingTop: '0px', overflowY: 'hidden' }}
      >
        <div className="sticky bg-white h-16 top-0 border-b mb-2 grid grid-cols-12 items-center z-10">
          <h2 className="col-span-6 pt-0 col-start-4 font-bold text-lg text-center">Salary of Employee</h2>
          <SalaryForm title="Create new Salary" />
        </div>
        <Spin spinning={!isSuccess}>
          <Table
            style={{ maxHeight: '46rem' }}
            columns={columns}
            dataSource={data}
            pagination={{ total: data?.length }}
          />
        </Spin>
      </Card>
    </>
  )
}
export default SalaryApp
