import React, { useRef, useState } from 'react'
import { Modal, Spin, Button, Divider } from 'antd'
import { FileText } from 'lucide-react'
import { useGetOneOrderQuery } from '@src/redux/endPoint/order'
import { convertDateWithTime, currencyFormatter } from '@src/utils'
import ReactToPrint from 'react-to-print'

const OrderDetailModal = ({ orderId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: orderDetails, isLoading: isLoadingOrderDetails } = useGetOneOrderQuery(orderId, {
    skip: !orderId || !isModalOpen
  })

  const componentRef = useRef()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      <Button onClick={showModal} type="text" shape="circle" className="flex items-center w-max">
        <FileText className="m-auto text-t-blue" />
      </Button>
      <Modal
        open={isModalOpen}
        width={600}
        confirmLoading={isLoadingOrderDetails}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={isLoadingOrderDetails}>
            Cancel
          </Button>,
          <ReactToPrint
            key="print"
            trigger={() => (
              <Button key="print" type="primary" loading={isLoadingOrderDetails}>
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        ]}
      >
        <Spin spinning={isLoadingOrderDetails}>
          <div ref={componentRef} className={componentRef ? 'p-5 bg-white rounded-md' : ''}>
            <div className="flex flex-col gap-3 pb-16 text-xl">
              <div className="flex gap-2 font-bold">
                <FileText className="" />
                Order Detail
              </div>
              <div className="font-medium">
                Employee: {orderDetails?.createdBy?.firstName + ' ' + orderDetails?.createdBy?.lastName}
              </div>
              <div className="font-medium">Created At: {convertDateWithTime(orderDetails?.createdAt)}</div>
            </div>
            <div className="flex gap-10 pb-20">
              <div className="flex flex-col gap-2 flex-grow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 font-bold">#</div>
                  <div className="col-span-5 font-bold">Product</div>
                  <div className="col-span-2 font-bold text-center">Quantity</div>
                  <div className="col-span-2 font-bold text-end">Price</div>
                  <div className="col-span-2 font-bold text-end">Total</div>
                </div>
                <Divider className="!py-1 !my-1" />

                {orderDetails?.orderDetail?.map(order => (
                  <div key={order.productId._id} className="px-1 bg-white w-full rounded-md">
                    <div className="w-full grid grid-cols-12 gap-2 font-medium">
                      <div className="col-span-1">{orderDetails.orderDetail.indexOf(order) + 1}</div>
                      <div className="col-span-5 flex items-center">{order.productId.name}</div>
                      <div className="col-span-2 text-center">{order.quantity}</div>
                      <div className="col-span-2 whitespace-nowrap text-end">{order.price.toLocaleString()}</div>
                      <div className="col-span-2 whitespace-nowrap text-end">
                        {(order.price * order.quantity).toLocaleString()}
                      </div>
                    </div>
                    {order?.voucherUsed?.length > 0 && (
                      <div className="w-full grid grid-cols-12 gap-2 font-medium mt-2">
                        <div className="col-span-3">Discount</div>
                        <div className="col-span-5"></div>
                        <div className="col-span-2 text-end font-medium">{order.voucherUsed[0].voucherPercent}%</div>
                        <div className="col-span-2 text-end font-medium">
                          {(
                            (order.price * order.quantity * order.voucherUsed[0].voucherPercent) /
                            100
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    <Divider className="!py-1 !my-1" />
                  </div>
                ))}

                <div className="grid grid-cols-12 gap-2 mt-8">
                  <div className="col-span-9 text-end font-bold">
                    Total
                    <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium ml-1">
                      {orderDetails?.orderDetail.length}
                    </span>
                    :
                  </div>
                  <div className="col-span-3 font-bold text-end">{currencyFormatter(orderDetails?.totalMoney)}</div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-9 text-end font-bold">Discount:</div>
                  <div className="col-span-3 font-bold text-end">0 VND</div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-9 text-end font-bold">Customer Payment:</div>
                  <div className="col-span-3 font-bold text-end">{currencyFormatter(orderDetails?.receivedMoney)}</div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-9 text-end font-bold">Excess:</div>
                  <div className="col-span-3 font-bold text-end">{currencyFormatter(orderDetails?.excessMoney)}</div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  )
}

export default OrderDetailModal
