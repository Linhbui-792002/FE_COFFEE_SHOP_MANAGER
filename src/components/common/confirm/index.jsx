import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import TooltipCustom from '../tooltip'

const Confirm = ({ children, type, icon, color, message, shape, danger, title, onConfirm, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    onConfirm?.()
    setTimeout(() => {
      setIsModalOpen(false)
    }, 500)
  }
  const handleCancel = () => {
    onCancel?.()
    setIsModalOpen(false)
  }
  return (
    <TooltipCustom title={title} color={color}>
      <Button type={type} danger={danger ? true : false} shape={shape} onClick={showModal} icon={icon}>
        {children}
      </Button>
      <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closable={false} okText="Confirm">
        <p className="text-center">{message}</p>
      </Modal>
    </TooltipCustom>
  )
}

export default Confirm
