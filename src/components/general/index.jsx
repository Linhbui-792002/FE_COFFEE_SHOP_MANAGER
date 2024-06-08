import { Breadcrumb, Spin } from 'antd'
import { Home, Settings } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import GeneralForm from './general-form'

const General = () => {
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false)
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
            <div className="col-span-12">
              <GeneralForm />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default General
