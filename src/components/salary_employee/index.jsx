import React, { useEffect, useState } from 'react'
import { Modal, Spin, Table } from 'antd'
import { useGetEmployeeSalaryQuery } from '@src/redux/endPoint/salary'

const SalaryEmployee = ({ isShow, isClose }) => {
  const [isModalVisible, setIsModalVisible] = useState(isShow);
  const { data, isLoading, isError, error } = useGetEmployeeSalaryQuery();
  console.log(data);
  const closeModel = () => {
    setIsModalVisible(false)
    isClose(true)
  }

  const columns = [
    {
      title: 'Work Terms',
      dataIndex: 'workTerm',
      key: 'workTerm',
      filters: data.map(item => ({
        text: `${item.workTerm}`,
        value: `${item.workTerm}`
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
    <Modal
      title="Salary information"
      width={960}
      open={isModalVisible}
      onCancel={closeModel}
      footer={null}
      keyboard={true}
      closable={true}
    >
      <Spin spinning={isLoading}>
        <Table className='mt-2' pagination={{ pageSize: 5 }} dataSource={data} columns={columns}></Table>
      </Spin>
    </Modal>
  )
}

export default SalaryEmployee
