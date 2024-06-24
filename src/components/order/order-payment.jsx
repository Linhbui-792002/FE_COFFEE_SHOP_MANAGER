import React from 'react'
import { Button, Divider, Modal, Spin } from 'antd'
import { useSelector } from 'react-redux'

const OrderPayment = ({
  isModalOpen,
  handleOpenPaymentModal,
  handleClosePaymentModal,
  orderDetail,
  totalOrder,
  totalQuantityOrder
}) => {
  return (
    <div className="flex items-center gap-2">
      <Spin spinning={false}>
        <Button onClick={handleOpenPaymentModal} className="flex items-center w-max">
          Payment
        </Button>
        <Modal
          title="Payment"
          open={isModalOpen}
          style={{ left: '23%' }}
          loading={true}
          okText="Submit"
          width={800}
          onCancel={handleClosePaymentModal}
          centered
        >
          <Spin spinning={false}>
            <div className="flex gap-10 min-h-[83vh]">
              <div className="w-[53%]">
                <div className="flex flex-col gap-2 flex-grow">
                  {orderDetail.map(order => (
                    <div key={order.id} className="px-2 bg-white w-full rounded-md">
                      <div className="w-full flex font-medium">
                        <div className="min-w-[40%] max-w-[40%] flex items-center ">{order?.name}</div>
                        <div className="w-32 font-medium">{order?.quantity}</div>
                        <div className="w-full flex gap-2 justify-around">
                          <div className="whitespace-nowrap">{order?.price?.toLocaleString()} </div>
                          <div className="whitespace-nowrap">{(order.price * order.quantity).toLocaleString()}</div>
                        </div>
                      </div>
                      <Divider className="!py-1 !my-1" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[40%] flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="font-bold">
                    Tổng tiền
                    <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
                      {totalQuantityOrder}
                    </span>
                  </div>
                  <div className="font-bold">
                    {totalOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}{' '}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">Giảm giá</div>
                  <div className="font-bold">0</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">Khách cần trả</div>
                  <div className="font-bold">
                    {totalOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}{' '}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">Khách thanh toán</div>
                  <div className="font-bold">
                    {totalOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}{' '}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
      </Spin>
    </div>
  )
}

export default OrderPayment
