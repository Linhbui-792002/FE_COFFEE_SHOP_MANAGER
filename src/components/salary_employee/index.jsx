import React, { useEffect, useState } from 'react'
import { Button, Modal, Spin, Table } from 'antd'
import { useGetEmployeeSalaryQuery } from '@src/redux/endPoint/salary'
import { Receipt } from 'lucide-react'

const SalaryEmployee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, error } = useGetEmployeeSalaryQuery('/', {})

  //create workTermSet:
  const workTermSet = new Set()
  const [filterWorkTerm, setFilterWorkTerm] = useState([])

  useEffect(() => {
    if (data) {
      workTermSet.clear()
      data.forEach(item => {
        if (!workTermSet.has(item.workTerm)) {
          workTermSet.add(item.workTerm)
        }
      })
      setFilterWorkTerm([...workTermSet])
    } else {
      setFilterWorkTerm([])
    }
  }, [data])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const columns = [
    {
      title: 'Work Terms',
      dataIndex: 'workTerm',
      key: 'workTerm',
      filters: filterWorkTerm?.map(item => ({
        key: item,
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
    }
  ]

  return (
    <Spin spinning={false}>
      <p onClick={showModal}> Salary info</p>
      <Modal
        title="Salary information"
        width={960}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        keyboard={true}
        closable={true}
      >
        <Spin spinning={isLoading}>
          <Table className="mt-2" pagination={{ pageSize: 5 }} dataSource={data} columns={columns}></Table>
        </Spin>
      </Modal>
    </Spin>
  )
}

export default SalaryEmployee
