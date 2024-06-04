import { Breadcrumb, Select, Spin } from 'antd'
import { Home, Settings, SquareUser } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import FormDisabledDemo from './general-form'

const MOCK_GENERAL = {
  email: 'demo@gmail.com',
  phone: 123456789,
  address: 'Đại Học FPT',
  logo: 'url demo'
}

const General = () => {
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false)

  //   const getGeneral = () => {
  //     setIsLoadingGeneral(true)
  //     setTimeout(() => {
  //       setIsLoadingGeneral(false)
  //     }, 2000)
  //   }

  //   useEffect(() => {
  //     getGeneral()
  //   }, [])
  return (
    <Spin spinning={isLoadingGeneral}>
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
                <Settings size={18} /> General
              </span>
            )
          }
        ]}
      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-12 bg-b-white rounded-md">
          <h1 className="text-2xl font-normal px-4 py-2">General Manager</h1>
          <div className="w-full grid grid-cols-12 gap-4 p-6">
            {/* {dataAccounts?.paginatedData?.map(account => (
              <AccountItem
                key={account?._id}
                isLoading={isLoadingAccounts}
                className="col-span-3 !w-full"
                item={account}
              />
            ))} */}
            <div className="col-span-12">
              <FormDisabledDemo />
            </div>
          </div>
        </div>
        {/* <div className="col-span-3 bg-b-white rounded-md flex flex-col items-end gap-4 p-6">
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
        </div> */}
      </div>
    </Spin>
  )
}

export default General
