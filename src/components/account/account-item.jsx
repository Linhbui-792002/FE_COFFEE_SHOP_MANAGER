import { Avatar, Card, Skeleton, Tag } from 'antd'
import { User, Pencil, LockKeyhole, LockKeyholeOpen, SquareAsterisk } from 'lucide-react'
import React from 'react'
import TooltipCustom from '../common/tooltip'
import { useEditAccountMutation, useResetPasswordMutation, useBlockAccountMutation } from '@src/redux/endPoint/account'
import Notification from '../common/notification'
import Confirm from '../common/confirm'
import AccountForm from './account-form'

const ResetPassword = ({ account }) => {
  const [resetPassword] = useResetPasswordMutation()

  const handleResetPassword = async () => {
    try {
      const accountId = account?._id
      await resetPassword({ accountId }).unwrap()
      Notification('success', 'Account Manager', 'Reset password successfully')
    } catch (error) {
      Notification('error', 'Account Manager', 'Failed call api')
    }
  }
  return (
    <Confirm
      icon={<SquareAsterisk className="m-auto text-t-orange" />}
      title="Reset password"
      color="gold"
      type="text"
      message={`Are you sure you want to reset password account ${account?.username}?`}
      onConfirm={handleResetPassword}
    />
  )
}

const ChangeStatusAccount = ({ account }) => {
  const [changeStatus] = useBlockAccountMutation()

  const handleChangeStatus = async () => {
    try {
      const body = {
        accountId: account?._id,
        status: !account.status
      }
      await changeStatus(body).unwrap()
      Notification('success', 'Account Manager', `${account?.status ? 'Unlock' : 'Lock'} successfully`)
    } catch (error) {
      Notification('error', 'Account Manager', 'Failed call api')
    }
  }
  return (
    <Confirm
      icon={
        account?.status ? (
          <LockKeyhole className="m-auto text-t-red" />
        ) : (
          <LockKeyholeOpen className="m-auto text-t-green" />
        )
      }
      title={account?.status ? 'Unlock account' : 'Lock account'}
      color={account?.status ? 'green' : 'red'}
      type="text"
      message={`Are you sure you want to ${account?.status ? 'Unlock' : 'Lock'} account ${account?.username}?`}
      onConfirm={handleChangeStatus}
    />
  )
}

const AccountItem = ({ className, isLoading, item }) => {
  return (
    <Card
      loading={isLoading}
      styles={{
        actions: {
          width: '100%'
        },
        body: {
          width: '100%',
          textAlign: 'center'
        }
      }}
      bordered={true}
      className={`${className} !w-full !flex flex-col items-center justify-between border-2`}
      cover={<Avatar className="!flex items-center mt-6 bg-b-gray" size={80} icon={<User size={50} />} />}
      actions={[
        <TooltipCustom title="Edit account" key="edit" color="blue">
          <AccountForm accountId={item?._id} type="text" title="Edit account" />
        </TooltipCustom>,
        <ChangeStatusAccount account={item} key="changeStatus" />,
        <ResetPassword account={item} key="resetPassword" />
      ]}
    >
      <Card.Meta
        title={item?.username}
        description={
          <div className="flex flex-col items-center gap-2">
            <Tag color={item?.role == 'Employee' ? 'blue' : 'gold'} className="w-max !m-0">
              {item.role}
            </Tag>
            <span
              className={`w - max status ${item?.onlineStatus ? 'before:bg-b-green text-t-green' : 'before:bg-b-gray'} `}
            >
              {item?.onlineStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        }
      />
    </Card>
  )
}

export default AccountItem
