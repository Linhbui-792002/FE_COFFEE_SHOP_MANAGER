import React, { useState, useEffect, useRef } from 'react'
import { Modal, Spin, Input, Button, Divider, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { removeOrder } from '@src/redux/slices/orderSlice'
import { useCreateOrderMutation } from '@src/redux/endPoint/order'
import Notification from '../common/notification'
import { useReactToPrint } from 'react-to-print'
import { currencyFormatter } from '@src/utils'
import OrderInvoice from './order-invoice'

const MOCK_VOUCHER = [
  { voucherId: 1, name: 'voucher1', voucherPercent: 10 },
  { voucherId: 2, name: 'voucher2', voucherPercent: 20 },
  { voucherId: 3, name: 'voucher3', voucherPercent: 30 },
  { voucherId: 4, name: 'voucher4', voucherPercent: 40 },
  { voucherId: 5, name: 'voucher5', voucherPercent: 50 },
  { voucherId: 6, name: 'voucher6', voucherPercent: 60 },
  { voucherId: 7, name: 'voucher7', voucherPercent: 70 },
  { voucherId: 8, name: 'voucher8', voucherPercent: 80 },
  { voucherId: 9, name: 'voucher9', voucherPercent: 90 },
  { voucherId: 10, name: 'voucher10', voucherPercent: 100 }
]

const OrderPaymentModal = ({ isOpen, onClose, orderDetails }) => {
  const dispatch = useDispatch()
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const [totalMoney, setTotalMoney] = useState(0)
  const [totalQuantityOrder, setTotalQuantityOrder] = useState(0)
  const [receivedMoney, setReceivedMoney] = useState(0)
  const [arrCalculate5ReceivedMoney, setArrCalculate5ReceivedMoney] = useState([])
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false)
  const [voucherData, setVoucherData] = useState(MOCK_VOUCHER)
  const [voucherPercent, setVoucherPercent] = useState(0)
  const [searchVoucher, setSearchVoucher] = useState('')
  const componentRef = useRef()

  const [createOrder, { isLoading: isLoadingCreateOrder }] = useCreateOrderMutation()

  const handlePayment = async () => {
    const discountedTotal = totalMoney * (1 - voucherPercent / 100)
    const orderData = {
      totalMoney: discountedTotal,
      receivedMoney: receivedMoney > discountedTotal ? receivedMoney : discountedTotal,
      excessMoney: receivedMoney - discountedTotal > 0 ? receivedMoney - discountedTotal : 0,
      voucherUsed: voucherPercent
        ? [
            {
              voucherId: voucherData.find(voucher => voucher.voucherPercent === voucherPercent).voucherId,
              voucherPercent: voucherPercent
            }
          ]
        : [],
      orderDetail: orderDetails.map(order => ({
        productId: order.id,
        quantity: order.quantity,
        costPrice: order.costPrice,
        price: order.price,
        voucherUsed: order.voucherUsed ?? []
      }))
    }

    try {
      await createOrder(orderData).unwrap()
      dispatch(removeOrder(activeKey))
      handlePrint()
      Notification('success', 'Order Created', 'Order created successfully')
      onClose()
    } catch (error) {
      Notification('error', 'Order Creation Failed', 'Failed to create order')
    }
  }

  const getArrCalculate5ReceivedMoney = minReceivedMoney => {
    const suggestions = [minReceivedMoney, minReceivedMoney + 1000]
    const next5000 = Math.ceil(minReceivedMoney / 5000) * 5000
    if (!suggestions.includes(next5000)) suggestions.push(next5000)
    if (!suggestions.includes(60000)) suggestions.push(60000)
    if (!suggestions.includes(100000)) suggestions.push(100000)
    if (!suggestions.includes(200000)) suggestions.push(200000)
    setArrCalculate5ReceivedMoney(suggestions)
  }

  const handleInputChange = e => {
    const value = +e.target.value
    setReceivedMoney(!isNaN(value) ? value : totalMoney)
  }

  const handleCloseVoucherModal = () => setIsModalVoucherOpen(false)
  const handleOpenVoucherModal = () => setIsModalVoucherOpen(true)

  useEffect(() => {
    if (searchVoucher === '') {
      setVoucherData(MOCK_VOUCHER)
    } else {
      setVoucherData(MOCK_VOUCHER.filter(voucher => voucher.name.toLowerCase().includes(searchVoucher.toLowerCase())))
    }
  }, [searchVoucher])

  useEffect(() => {
    const total = orderDetails.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    const quantity = orderDetails.reduce((acc, cur) => acc + cur.quantity, 0)
    setTotalQuantityOrder(quantity)
    setTotalMoney(total)
    setReceivedMoney(total)
    getArrCalculate5ReceivedMoney(total)
  }, [orderDetails])

  useEffect(() => {
    if (voucherPercent !== 0) {
      getArrCalculate5ReceivedMoney(totalMoney * (1 - voucherPercent / 100))
    }
  }, [voucherPercent])

  useEffect(() => {
    setVoucherPercent(0)
  }, [isOpen])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  const TotalMoneyWithDiscount = totalMoney * (1 - voucherPercent / 100)
  const discountMoney = voucherPercent ? totalMoney * (voucherPercent / 100) : 0

  return (
    <>
      <div style={{ display: 'none' }}>
        <OrderInvoice
          ref={componentRef}
          orderDetails={orderDetails}
          totalQuantityOrder={totalQuantityOrder}
          totalMoney={totalMoney}
          receivedMoney={receivedMoney}
          discountMoney={discountMoney}
        />
      </div>
      <Modal
        title={`Order-${activeKey}`}
        open={isOpen}
        style={{ left: '23%' }}
        okText="Save"
        width={800}
        onOk={handlePayment}
        confirmLoading={isLoadingCreateOrder}
        onCancel={onClose}
        centered
        okButtonProps={{ loading: isLoadingCreateOrder }}
        cancelButtonProps={{ disabled: isLoadingCreateOrder }}
      >
        <Spin spinning={isLoadingCreateOrder}>
          <div className="flex gap-10">
            <div className="flex gap-10 min-h-[83vh]">
              <div className="w-[53%]">
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="grid grid-cols-12">
                    <div className="col-span-1 font-bold">#</div>
                    <div className="col-span-5 font-bold">Product</div>
                    <div className="col-span-2 font-bold text-center">Quantity</div>
                    <div className="col-span-2 font-bold text-end">Price</div>
                    <div className="col-span-2 font-bold text-end">Total</div>
                  </div>
                  <Divider className="!py-1 !my-1" />

                  {orderDetails.map(order => (
                    <div key={order.id} className="px-1 bg-white w-full rounded-md" onClick={handleOpenVoucherModal}>
                      <div className="w-full grid grid-cols-12 gap-2 font-medium">
                        <div className="col-span-1">{orderDetails.indexOf(order) + 1}</div>
                        <div className="col-span-5 flex items-center">{order.name}</div>
                        <div className="col-span-2 text-center">{order.quantity}</div>
                        <div className="col-span-2 whitespace-nowrap text-end">
                          {currencyFormatter(order.price, '')}
                        </div>
                        <div className="col-span-2 whitespace-nowrap text-end">
                          {currencyFormatter(order.price * order.quantity, '')}
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
                    Total
                    <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
                      {totalQuantityOrder}
                    </span>
                  </div>
                  <div className="font-bold">{currencyFormatter(totalMoney, '')}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">
                    Discount
                    <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
                      {voucherPercent ? voucherPercent + '%' : 0}
                    </span>
                  </div>
                  <Input
                    className={`!border-none !outline-none !w-max-content !bg-red text-right pr-0 w-40 font-bold ${
                      receivedMoney - totalMoney < 0 ? 'text-red-500' : ''
                    }`}
                    value={voucherPercent ? currencyFormatter(totalMoney * (voucherPercent / 100), '') : 0}
                    onClick={() => setIsModalVoucherOpen(true)}
                    readOnly
                  />
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">Amount Due</div>
                  <div className="font-bold">{currencyFormatter(TotalMoneyWithDiscount, '')}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold">Customer Payment</div>
                  <Input
                    className={`!border-none !outline-none !w-max-content !bg-red text-right pr-0 w-20 font-bold ${
                      receivedMoney - TotalMoneyWithDiscount < 0 ? 'text-red-500' : ''
                    }`}
                    onChange={handleInputChange}
                    value={
                      receivedMoney - TotalMoneyWithDiscount < 0
                        ? currencyFormatter(receivedMoney, '')
                        : currencyFormatter(TotalMoneyWithDiscount, '')
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2 flex-wrap border border-spacing-0 p-2 rounded-md bg-slate-100">
                    {arrCalculate5ReceivedMoney.map((item, index) => (
                      <Button key={index} onClick={() => setReceivedMoney(item)} className="rounded-3xl">
                        {currencyFormatter(item, '')}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold">Excess</div>
                  <div className="font-bold">
                    {currencyFormatter(
                      receivedMoney - TotalMoneyWithDiscount > 0 ? receivedMoney - TotalMoneyWithDiscount : 0,
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
      <Modal
        title="Voucher"
        open={isModalVoucherOpen}
        okText="Submit"
        width={400}
        // onOk={handlePayment}
        confirmLoading={isLoadingCreateOrder}
        onCancel={handleCloseVoucherModal}
        centered
        okButtonProps={{ loading: isLoadingCreateOrder }}
        cancelButtonProps={{ disabled: isLoadingCreateOrder }}
      >
        <Select
          className="w-full"
          labelInValue
          showSearch
          filterOption={false}
          onChange={(value, option) => setVoucherPercent(option.percent)}
          onSearch={setSearchVoucher}
          options={voucherData.map(voucher => ({
            label:
              voucher.name +
              ` - ${voucher.voucherPercent}%` +
              ` - ${currencyFormatter(totalMoney * (voucher.voucherPercent / 100))}`,
            value: voucher.voucherId,
            percent: voucher.voucherPercent
          }))}
        />
      </Modal>
    </>
  )
}

export default OrderPaymentModal
