import React, { useState } from 'react'
import { Button, Form, Input, Modal, Spin } from 'antd'
import { Pencil, UserRoundPlus } from 'lucide-react'
import Notification from '../common/notification'

const OrderPayment = ({ label, orderDetail, title, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const orderData = {
        totalMoney: calculateTotalMoney(),
        receivedMoney: 0, // Assuming initial received money is 0
        excessMoney: 0, // Assuming initial excess money is 0
        orderDetail: orderDetail.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          costPrice: item.price, // Assuming costPrice is the same as price
          price: item.price,
          voucherUsed: [] // Assuming no vouchers are used initially
        }))
      }

      await createOrder(orderData).unwrap()
      Notification('success', 'Order Manager', 'Order created successfully')
      setIsLoading(false)
      handleCancel()
    } catch (error) {
      setIsLoading(false)
      Notification('error', 'Order Manager', 'Failed to create order')
    }
  }

  const calculateTotalMoney = () => {
    return orderDetail.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button
        type={type}
        icon={<UserRoundPlus size={18} />}
        shape="default"
        onClick={showModal}
        className="flex items-center w-max"
      >
        {label}
      </Button>
      <Modal
        title={title}
        visible={isModalOpen}
        onOk={handlePayment}
        onCancel={handleCancel}
        confirmLoading={isCreatingOrder}
        okText="Pay"
        width={600}
        centered
      >
        <Spin spinning={isLoading}>
          <Form layout="vertical" autoComplete="off">
            {orderDetail.map(item => (
              <Form.Item key={item.id} label={`${item.name} (${item.quantity})`} name={`quantity_${item.id}`}>
                <Input value={`${item.price * item.quantity}`} disabled />
              </Form.Item>
            ))}
            <Form.Item label="Total" name="total">
              <Input value={`${calculateTotalMoney()}`} disabled />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default OrderPayment
