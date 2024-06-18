import React, { useEffect, useMemo, useState } from 'react'
import { Button, Divider, InputNumber, Modal, Select, Spin, message } from 'antd'
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrder, removeOrderDetailInOrder, removeOrder } from '@src/redux/slices/orderSlice'
import { useCreateOrderMutation } from '@src/redux/endPoint/order'
import Notification from '../common/notification'

const MOCK_VOUCHER = [
  {
    id: 1,
    name: 'Voucher 1',
    discount: 10
  },
  {
    id: 2,
    name: 'Voucher 2',
    discount: 20
  }
]

const OrderItem = () => {
  const [totalMoney, setTotalMoney] = useState(0)
  const [totalQuantityOrder, setTotalQuantityOrder] = useState(0)
  const [receivedMoney, setReceivedMoney] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false)
  const [arrCalculate5ReceivedMoney, setArrCalculate5ReceivedMoney] = useState([])
  const [searchVoucher, setSearchVoucher] = useState('')
  const [voucherData, setVoucherData] = useState(MOCK_VOUCHER)

  const [createOrder, { isLoading: isLoadingCreateOrder }] = useCreateOrderMutation()

  const orderDetails = useSelector(state => state.order.orderDetail?.listOrder ?? [])
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()

  const updateOrderQuantity = (orderId, action, quantity = 1) => {
    dispatch(updateOrder({ key: activeKey, status: action, orderDetail: { id: orderId }, quantity }))
  }

  const handleDelete = orderId => {
    dispatch(removeOrderDetailInOrder({ key: activeKey, id: orderId }))
  }

  const handleOpenPaymentModal = () => setIsModalOpen(true)
  const handleClosePaymentModal = () => setIsModalOpen(false)
  const handleOpenVoucherModal = () => setIsModalVoucherOpen(true)
  const handleCloseVoucherModal = () => setIsModalVoucherOpen(false)

  const handlePayment = async () => {
    const orderData = {
      totalMoney: totalMoney,
      receivedMoney: receivedMoney,
      excessMoney: receivedMoney - totalMoney > 0 ? receivedMoney - totalMoney : 0,
      voucherUsed: [],
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
      console.log(orderData, 'orderData')
      Notification('success', 'Order Create', 'Create order successfully')
      dispatch(removeOrder(activeKey))
      handleClosePaymentModal()
    } catch (error) {
      Notification('error', 'Order Create', 'Create order fail')
    }
  }

  const getArrCalculate5ReceivedMoney = minReceivedMoney => {
    const suggestions = [minReceivedMoney]

    suggestions.push(minReceivedMoney + 1000)
    const next5000 = Math.ceil(minReceivedMoney / 5000) * 5000
    if (!suggestions.includes(next5000)) {
      suggestions.push(next5000)
    }
    if (!suggestions.includes(60000)) {
      suggestions.push(60000)
    }
    if (!suggestions.includes(100000)) {
      suggestions.push(100000)
    }
    if (!suggestions.includes(200000)) {
      suggestions.push(200000)
    }
    setArrCalculate5ReceivedMoney(suggestions)
  }

  useEffect(() => {
    if (searchVoucher === '') {
      setVoucherData(MOCK_VOUCHER)
    } else {
      const filterData = MOCK_VOUCHER.filter(voucher =>
        voucher.name.toLowerCase().includes(searchVoucher.toLowerCase())
      )
      setVoucherData(filterData)
    }
  }, [searchVoucher])

  useEffect(() => {
    const total = orderDetails.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    const quantity = orderDetails.reduce((acc, cur) => acc + cur.quantity, 0)
    setTotalQuantityOrder(quantity)
    setTotalMoney(total)
    getArrCalculate5ReceivedMoney(total)
  }, [orderDetails])

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2 flex-grow">
        {orderDetails.map(order => (
          <div key={order.id} className="px-2 bg-white w-full rounded-md">
            <div className="w-full flex justify-between gap-4 items-center">
              <div className="min-w-[40%] max-w-[40%] flex items-center gap-2 font-bold">
                <DeleteOutlined
                  className="w-[2rem] h-[2rem] text-lg p-2 border-[1px] border-b-red rounded-full cursor-pointer"
                  onClick={() => handleDelete(order.id)}
                />
                {order.name}
              </div>
              <div className="w-full font-medium">
                <InputNumber
                  addonBefore={
                    <MinusCircleOutlined
                      onClick={() => updateOrderQuantity(order.id, 'down')}
                      className="cursor-pointer"
                    />
                  }
                  addonAfter={
                    <PlusCircleOutlined
                      onClick={() => updateOrderQuantity(order.id, 'up')}
                      className="cursor-pointer"
                    />
                  }
                  controls={false}
                  onChange={value => updateOrderQuantity(order.id, 'change', value)}
                  min={1}
                  max={50}
                  value={order.quantity}
                  className="w-[9rem] text-center"
                />
              </div>
              <div className="w-full flex gap-2 justify-around">
                <div className="underline whitespace-nowrap">{order.price.toLocaleString()}</div>
                <div className="whitespace-nowrap">{(order.price * order.quantity).toLocaleString()}</div>
              </div>
            </div>
            <Divider className="!py-1 !my-1" />
          </div>
        ))}
      </div>
      <div className="w-full flex mt-4 justify-end items-center">
        <Spin spinning={isLoadingCreateOrder}>
          <Button type="primary" onClick={handleOpenPaymentModal} className="w-[200px]">
            Payment
          </Button>
          <Modal
            title={`Payment Order ` + activeKey}
            open={isModalOpen}
            style={{ left: '23%' }}
            okText="Submit"
            width={800}
            onOk={handlePayment}
            confirmLoading={isLoadingCreateOrder}
            onCancel={handleClosePaymentModal}
            centered
            okButtonProps={{ loading: isLoadingCreateOrder }}
            cancelButtonProps={{ disabled: isLoadingCreateOrder }}
          >
            <Spin spinning={isLoadingCreateOrder}>
              <div className="flex gap-10 min-h-[83vh]">
                <div className="w-[53%]">
                  <div className="flex flex-col gap-2 flex-grow">
                    {orderDetails.map(order => (
                      <div
                        key={order.id}
                        className="px-1 mt-4 bg-white w-full rounded-md"
                        onClick={handleOpenVoucherModal}
                      >
                        <div className="w-full flex font-medium">
                          <div className="min-w-[40%] max-w-[40%] flex items-center">{order.name}</div>
                          <div className="w-32 font-medium">{order.quantity}</div>
                          <div className="w-full flex gap-2 justify-around">
                            <div className="whitespace-nowrap">{order.price.toLocaleString()}</div>
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
                      Total
                      <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
                        {totalQuantityOrder}
                      </span>
                    </div>
                    <div className="font-bold">{totalMoney.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Discount</div>
                    <div className="font-bold">0</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Amount Due</div>
                    <div className="font-bold">{totalMoney.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Customer Payment</div>
                    <InputNumber
                      className="border-none !border-b-2 border-blue-500 focus:border-blue-700 text-right"
                      onChange={value => setReceivedMoney(value)}
                      min={totalMoney}
                      controls={false}
                      value={receivedMoney}
                    />
                  </div>
                  <div className="flex justify-between">
                    {/* gen list arrCalculate5ReceivedMoney option to setReceivedMoney for receivedMoney*/}
                    <div className="flex gap-2 flex-wrap border border-spacing-0 p-2 rounded-md bg-slate-100">
                      {arrCalculate5ReceivedMoney.map((item, index) => (
                        <Button key={index} onClick={() => setReceivedMoney(item)} className="rounded-3xl">
                          {item.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Excess</div>
                    <div className="font-bold">
                      {(receivedMoney - totalMoney > 0 ? receivedMoney - totalMoney : 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          </Modal>
          {/* Modal select include voucher list */}
          <Modal
            title="Voucher"
            open={isModalVoucherOpen}
            okText="Submit"
            width={400}
            onOk={handlePayment}
            confirmLoading={isLoadingCreateOrder}
            onCancel={handleCloseVoucherModal}
            centered
            okButtonProps={{ loading: isLoadingCreateOrder }}
            cancelButtonProps={{ disabled: isLoadingCreateOrder }}
          >
            <Select
              className="w-full"
              labelInValue
              // loading={isLoadingProductPublic}
              showSearch
              filterOption={false}
              onSearch={setSearchVoucher}
              options={
                voucherData &&
                voucherData.map(voucher => ({
                  label: voucher.name,
                  value: voucher.id,
                  discount: voucher.discount
                }))
              }
            />
          </Modal>
        </Spin>
        <div className="ml-auto flex gap-2 items-end">
          <div className="font-bold">
            Total
            <span className="border border-[#f0f0f0] bg-[#f0f0f0] text-[#333] px-2 py-0.5 rounded-[50%] font-medium mx-1">
              {totalQuantityOrder}
            </span>
          </div>
          <div className="font-bold">{totalMoney.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
