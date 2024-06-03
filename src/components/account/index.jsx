import { Breadcrumb, Card, Form, Input, Pagination, Select, Spin, Statistic, Tag } from 'antd'
import { Home, LockKeyhole, LockKeyholeOpen, SquareUser, UserSearch } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import AccountForm from './account-form'
import AccountItem from './account-item'
import { ACCOUNT_STATUS, ROLES, STATUS_ONLINE } from '@src/constants'
import { useGetAllAccountQuery } from '@src/redux/endPoint/account'
const ITEMS_PER_PAGE = 8
const Account = () => {
  const [options, setOptions] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [formFilterData, setFormFilterData] = useState({
    username: '',
    onlineStatus: '',
    status: '',
    role: ''
  })
  const { data: metadataAccounts, isLoading: isLoadingAccounts } = useGetAllAccountQuery()

  const handleChange = (name, value) => {
    setCurrentPage(1)
    setFormFilterData({
      ...formFilterData,
      [name]: value ?? ''
    })
  }
  useEffect(() => {
    if (!isLoadingAccounts && metadataAccounts) {
      const { options } = metadataAccounts
      setOptions(options)
    }
  }, [isLoadingAccounts, metadataAccounts])

  const dataAccounts = useMemo(() => {
    const data = metadataAccounts?.metadata
    const hasFilter = Object.values(formFilterData).some(value => value !== '')

    const filteredData = hasFilter
      ? data.filter(account => {
        const usernameMatch =
          !formFilterData.username ||
          account.username
            .replace(/\s/g, '')
            .toLowerCase()
            .includes(formFilterData.username.replace(/\s/g, '').toLowerCase())
        const onlineStatusMatch =
          formFilterData.onlineStatus === '' || account.onlineStatus === formFilterData.onlineStatus
        const statusMatch = formFilterData.status === '' || account.status === formFilterData.status
        const roleMatch = formFilterData.role === '' || account.role === formFilterData.role

        return usernameMatch && onlineStatusMatch && statusMatch && roleMatch
      })
      : data

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedData = filteredData?.slice(startIndex, endIndex)
    return {
      paginatedData,
      total: filteredData?.length
    }
  }, [metadataAccounts, formFilterData, isLoadingAccounts, currentPage])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <Spin spinning={isLoadingAccounts}>
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
                <SquareUser size={18} /> Accounts
              </span>
            )
          }
        ]}
      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-9 bg-b-white rounded-md">
          <h1 className="text-2xl font-normal px-4 py-2">Accounts Manager</h1>
          <div className="flex justify-end gap-4 p-6">
            <Input
              placeholder="Enter username"
              prefix={<UserSearch strokeWidth={1.25} />}
              size="middle"
              className="!min-w-44 !max-w-52"
              onChange={e => handleChange('username', e.target.value)}
            />
            <Select
              onChange={value => handleChange('role', value)}
              allowClear={true}
              placeholder="Role"
              className="!min-w-32"
              options={Object.keys(ROLES)?.map(key => ({
                label: (
                  <Tag color={key == 'EMPLOYEE' ? 'blue' : 'gold'} className="w-max !m-0">
                    {key}
                  </Tag>
                ),
                value: ROLES[key]
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('onlineStatus', value)}
              placeholder="Status"
              className="!min-w-28"
              options={Object.keys(STATUS_ONLINE)?.map(key => ({
                label: (
                  <span
                    className={`w-max status ${STATUS_ONLINE[key] ? 'before:bg-b-green text-t-green' : 'before:bg-b-gray'}`}
                  >
                    {key}
                  </span>
                ),
                value: STATUS_ONLINE[key]
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('status', value)}
              placeholder="Block"
              className="!min-w-28"
              options={Object.keys(ACCOUNT_STATUS)?.map(key => ({
                label: (
                  <span className="flex items-center gap-2">
                    {' '}
                    {ACCOUNT_STATUS[key] ? (
                      <LockKeyhole size={12} className="text-t-red" />
                    ) : (
                      <LockKeyholeOpen size={12} className="text-t-green" />
                    )}{' '}
                    {key}
                  </span>
                ),
                value: ACCOUNT_STATUS[key]
              }))}
            />
          </div>
          <div className="w-full grid grid-cols-12 gap-4 p-6">
            {dataAccounts?.paginatedData?.map(account => (
              <AccountItem
                key={account?._id}
                isLoading={isLoadingAccounts}
                className="col-span-3 !w-full"
                item={account}
              />
            ))}
          </div>
          <div className="col-span-12 my-4 mr-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={dataAccounts?.total}
              pageSize={ITEMS_PER_PAGE}
              onChange={handlePageChange}
              className="w-max"
            />
          </div>
        </div>

        <div className="col-span-3 bg-b-white rounded-md flex flex-col items-end gap-4 p-6">
          <AccountForm label="New account" title="Create account" />
          <div className="flex flex-col gap-3 !w-full">
            <Card
              bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-orange "
            >
              <Statistic title="Account Total" value={options?.totalAccount} />
            </Card>
            <Card
              bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-green"
            >
              <Statistic title="Account Online" value={options?.totalAccountOnline} valueStyle={{ color: '#3CA31B' }} />
            </Card>
            <Card
              bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-gray"
            >
              <Statistic title="Account Offline" value={options?.totalAccountOffline} />
            </Card>
            <Card
              bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-red"
            >
              <Statistic title="Account Block" value={options?.totalAccountBlock} valueStyle={{ color: '#E53E3E' }} />
            </Card>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default Account
