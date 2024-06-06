import React from 'react'
import { Breadcrumb, Space, Spin, Table, Tag } from 'antd';
import Link from 'next/link';
import { Home, UserRoundCog, UserRoundX, Users } from 'lucide-react';
import EmployeeForm from './employee-form';
import { useGetAllEmployeeQuery } from '@src/redux/endPoint/employee';
import Confirm from '../common/confirm';
import TooltipCustom from '../common/tooltip';
import { STATUS_EMPLOYEE } from '@src/constants'
import { convertDate } from '@src/utils';
import { useColumnSearch } from '&common/column-search-props'
import { useEditEmployeeMutation  } from '@src/redux/endPoint/employee'
import Notification from '../common/notification'


const ChangeStatusEmployee = ({ employee }) => {
  // const [changeStatus] = useBlockAccountMutation()
  const [editEmployee, { isLoading: isLoadingUpdate }] = useEditEmployeeMutation()

  const handleChangeStatus = async () => {
    try {
      const body = {
        employeeId: employee._id,
        status: !employee.status
      }
      await editEmployee(body).unwrap()
      Notification('success', 'Employee Manager', `${employee?.status ? 'Set status doing' : 'Set status retire'} successfully`)
    } catch (error) {
      Notification('error', 'Account Manager', 'Failed call api')
    }
  }
  return (
    <Confirm
      icon={
        !employee?.status ? (
          <UserRoundX className="m-auto text-t-red" />
        ) : (
          <UserRoundCog className="m-auto text-t-green" />
        )
      }
      title={employee?.status ? 'Set status retire' : 'Set status doing'}
      color={employee?.status ? 'red' : 'green'}
      type="text"
      message={`Are you sure you want to ${employee?.status ? 'set status retire' : 'set status doing'} employee ${employee?.firstName} ${employee?.lastName}?`}
      onConfirm={handleChangeStatus}
    />
  )
}


const Employee = () => {
  const { data: listEmployee, isLoading } = useGetAllEmployeeQuery()
  console.log(listEmployee, 'listEmployee');
  const { getColumnSearchProps } = useColumnSearch();
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      ...getColumnSearchProps('firstName', 'First Name'),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      ...getColumnSearchProps('lastName', 'Last Name'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber', 'Phone Number'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: STATUS_EMPLOYEE?.map((item) => ({ text: item?.label, value: item?.value })),
      onFilter: (value, record) => {
        return record?.status == value;
      },
      render: (_, { status }) => (
        <>
          <Tag
            color={status ? 'green' : 'red'}
            key={status}
          >
            {status ? 'Doing' : 'Retired'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (_, { gender }) => (
        <>
          <Tag
            color={gender ? 'pink' : 'gray'}
            key={gender}
          >
            {gender ? 'Female' : 'Male'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => (convertDate(createdAt))
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, { updatedAt }) => (convertDate(updatedAt))
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ChangeStatusEmployee employee={record} />
          <TooltipCustom title="Edit employee" key="edit" color="blue">
            <EmployeeForm employeeId={record?._id} type="text" title="Edit employee" />
          </TooltipCustom>
        </Space>
      ),
    },
  ];

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
                <Users size={18} /> Employee
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Employee Manager</h1>
          <EmployeeForm title="Add new employee" label="New Employee" />
        </div>
        <div className="px-4 py-5 mt-12">
          <Table
            pagination={{ pageSize: 5 }}
            dataSource={listEmployee}
            columns={columns}
          />
        </div>
      </div>
    </Spin>
  )
}

export default Employee