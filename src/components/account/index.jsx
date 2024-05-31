import { Breadcrumb, Card, Statistic } from 'antd'
import { Home, SquareUser } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AccountForm from './account-form'

const Account = () => {
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link href="/" className='!flex gap-1 items-center w-max'> <Home size={18} />  Home</Link>
          },
          { title: <span className='!flex gap-1 items-center w-max'><SquareUser size={18} /> Accounts</span> }
        ]}

      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6 ">
        <div className="col-span-9 bg-b-white rounded-md ">
          <h1 className="text-xl font-normal px-4 py-2">Accounts Manager</h1>
        </div>
        <div className="col-span-3 bg-b-white rounded-md flex flex-col items-end gap-4 p-6">
          <AccountForm
            label="New account"
            title="Create account"
          />
          <div className="flex flex-col gap-3 !w-full">
            <Card bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-orange "
            >
              <Statistic
                title="Account Total"
                value={10}
              />
            </Card>
            <Card bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-green"
            >
              <Statistic
                title="Account Online"
                value={10}
                valueStyle={{ color: '#3CA31B' }}
              />
            </Card>
            <Card bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-gray"
            >
              <Statistic
                title="Account Offline"
                value={10}
              />
            </Card>
            <Card bordered={false}
              styles={{
                body: {
                  padding: '0.6rem'
                }
              }}
              className="px-3 card-statistic before:bg-b-red"
            >
              <Statistic
                title="Account Block"
                value={10}
                valueStyle={{ color: "#E53E3E" }}
              />
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Account
