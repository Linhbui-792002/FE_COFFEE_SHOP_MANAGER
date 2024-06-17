import { Avatar, Card, Tag } from 'antd'
import React, { useState } from 'react'
import CustomImage from '../common/custom-image'
import { currencyFormatter } from '@src/utils'
import TooltipCustom from '../common/tooltip'
import Notification from '../common/notification'
import Confirm from '../common/confirm'
import { LockKeyhole, LockKeyholeOpen, SquareAsterisk } from 'lucide-react'
import AccountForm from '../account/account-form'
import ProductForm from './product-form'
const ResetPassword = ({ product }) => {
  // const [resetPassword] = useResetPasswordMutation()

  const handleResetPassword = async () => {
    // try {
    //   const accountId = account?._id
    //   await resetPassword({ accountId }).unwrap()
    //   Notification('success', 'Account Manager', 'Reset password successfully')
    // } catch (error) {
    //   Notification('error', 'Account Manager', 'Failed call api')
    // }
  }
  return (
    <Confirm
      icon={<SquareAsterisk className="m-auto text-t-orange" />}
      title="Reset password"
      color="gold"
      type="text"
      message={`Are you sure you want to reset password account `}
      onConfirm={handleResetPassword}
    />
  )
}

const ChangeStatusAccount = ({ product }) => {
  // const [changeStatus] = useBlockAccountMutation()

  const handleChangeStatus = async () => {
    // try {
    //   const body = {
    //     accountId: account?._id,
    //     status: !account.status
    //   }
    //   await changeStatus(body).unwrap()
    //   Notification('success', 'Account Manager', `${account?.status ? 'Unlock' : 'Lock'} successfully`)
    // } catch (error) {
    //   Notification('error', 'Account Manager', 'Failed call api')
    // }
  }
  return (
    <Confirm
      icon={
        product?.status ? (
          <LockKeyhole className="m-auto text-t-red" />
        ) : (
          <LockKeyholeOpen className="m-auto text-t-green" />
        )
      }
      title={product?.status ? 'Unlock account' : 'Lock account'}
      color={product?.status ? 'green' : 'red'}
      type="text"
      message={`Are you sure you want to ${product?.status ? 'Unlock' : 'Lock'} account ${product?.username}?`}
      onConfirm={handleChangeStatus}
    />
  )
}
const ProductItem = ({ isLoading, className, item }) => {
  console.log(item)
  return (
    <Card
      loading={isLoading}
      styles={{
        actions: {
          width: '100%'
        },
        body: {
          width: '100%'
        }
      }}
      bordered={true}
      className={`${className} !w-full !flex flex-col justify-between border-2`}
      cover={
        <CustomImage
          onLoad={isLoading}
          height={400}
          width={400}
          src={`${process.env.PUBLIC_IMAGE_API_BASE_URL}/${item?.image}`}
          alt="Image product"
          className="bg-b-gray w-[10rem] h-[10rem]"
        />
      }
      actions={[
        <TooltipCustom title="Edit product" key="edit" color="blue">
          <ProductForm productId={item?._id} type="text" title="Edit product" />
        </TooltipCustom>,
        <ChangeStatusAccount product={item} key="changeStatus" />,
        <ResetPassword product={item} key="resetPassword" />
      ]}
      hoverable
    >
      <Card.Meta
        className=""
        title={<span className="truncate ...">{item?.name}</span>}
        description={
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Cost Price:</span>
              <span className="text-t-black font-normal">{currencyFormatter(item?.costPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="text-t-black font-medium underline">{currencyFormatter(item?.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <Tag color={item?.isCombo ? 'gold' : 'red'} className="w-max !m-0">
                {item?.isCombo ? 'Combo' : 'Product'}
              </Tag>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Tag color={item?.status ? 'green' : 'gray'} className="w-max !m-0">
                {item?.status ? 'Public' : 'Draft'}
              </Tag>
            </div>
          </div>
        }
      />
    </Card>
  )
}

export default ProductItem
