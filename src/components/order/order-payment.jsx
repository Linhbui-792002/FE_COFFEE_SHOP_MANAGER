import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Modal, Spin, Input, Button, Divider, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { removeOrder, updateOrder } from '@src/redux/slices/orderSlice'
import { useCreateOrderMutation } from '@src/redux/endPoint/order'
import Notification from '../common/notification'
import { useReactToPrint } from 'react-to-print'
import { currencyFormatter } from '@src/utils'
import OrderInvoice from './order-invoice'
import { useGetVouchersCartQuery, useGetVouchersProductQuery } from '@src/redux/endPoint/voucher'

const OrderPaymentModal = ({ isOpen, onClose, orderDetails }) => {
  const dispatch = useDispatch()
  const activeKey = useSelector(state => state.order.keyOrderActive)
  const [totalMoney, setTotalMoney] = useState(0)
  const [totalQuantityOrder, setTotalQuantityOrder] = useState(0)
  const [receivedMoney, setReceivedMoney] = useState(0)
  const [orderItem, setOrderItem] = useState()
  const [arrCalculate5ReceivedMoney, setArrCalculate5ReceivedMoney] = useState([])
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false)
  const [selectedVoucherProduct, setSelectedVoucherProduct] = useState(null)
  const [isModalVoucherProductOpen, setIsModalVoucherProductOpen] = useState(false)
  const [voucherCart, setVoucherCart] = useState({
    voucherId: '',
    voucherPercent: 0
  })
  const [voucherProduct, setVoucherProduct] = useState({
    voucherId: '',
    voucherPercent: 0,
    product: []
  })
  const [searchVoucher, setSearchVoucher] = useState('')
  const [searchVoucherProduct, setSearchVoucherProduct] = useState('')
  const componentRef = useRef()

  const { data: listVoucherCart, isLoading: isLoadingVoucherCart } = useGetVouchersCartQuery('/', {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  })
  const { data: listVoucherProduct, isLoading: isLoadingVoucherProduct } = useGetVouchersProductQuery('/', {
    skip: !isModalVoucherProductOpen,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  })

  const [createOrder, { isLoading: isLoadingCreateOrder }] = useCreateOrderMutation()

  const handlePayment = async () => {
    const discountAmount = voucherCart.voucherId
      ? Math.min(totalMoney * (voucherCart.voucherPercent / 100), voucherCart.maxDiscount)
      : 0

    const discountedTotal = totalMoney - discountAmount

    const orderData = {
      totalMoney: discountedTotal,
      receivedMoney: receivedMoney > discountedTotal ? receivedMoney : discountedTotal,
      excessMoney: receivedMoney - discountedTotal > 0 ? receivedMoney - discountedTotal : 0,
      voucherUsed: voucherCart.voucherPercent
        ? [
            {
              voucherId: listVoucherCart.find(voucher => voucher._id === voucherCart._id),
              voucherPercent: voucherCart.voucherPercent
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
    const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000]

    const generateSuggestions = (minAmount, denomList) => {
      const suggestions = new Set()

      suggestions.add(minAmount)

      let incrementAmount = denomList[denomList.length - 1] // Start with the highest denomination
      let currentAmount = minAmount

      while (suggestions.size < 5) {
        currentAmount += incrementAmount

        if (currentAmount >= minAmount) {
          suggestions.add(currentAmount)
        }
      }

      return Array.from(suggestions).sort((a, b) => a - b)
    }

    const suggestions = generateSuggestions(minReceivedMoney, denominations)

    setArrCalculate5ReceivedMoney(suggestions)
  }

  // const getArrCalculate5ReceivedMoney = minReceivedMoney => {
  //   const suggestions = [minReceivedMoney, minReceivedMoney + 1000]
  //   const next5000 = Math.ceil(minReceivedMoney / 5000) * 5000
  //   if (!suggestions.includes(next5000)) suggestions.push(next5000)
  //   if (!suggestions.includes(60000)) suggestions.push(60000)
  //   if (!suggestions.includes(100000)) suggestions.push(100000)
  //   if (!suggestions.includes(200000)) suggestions.push(200000)
  //   setArrCalculate5ReceivedMoney(suggestions)
  // }

  const handleInputChange = e => {
    const value = +e.target.value
    setReceivedMoney(value ? value : totalMoney)
  }

  const handleCloseVoucherModal = () => setIsModalVoucherOpen(false)
  const handleOpenVoucherModal = () => setIsModalVoucherOpen(true)

  const handleCloseVoucherProductModal = () => {
    setOrderItem('')
    setVoucherProduct({
      voucherId: '',
      voucherPercent: 0,
      product: []
    })
    setSelectedVoucherProduct(null)
    setIsModalVoucherProductOpen(false)
  }
  const handleOpenVoucherProductModal = order => {
    setOrderItem(order)
    setSelectedVoucherProduct(order?.voucherUsed?.[0]?.voucherId)
    setIsModalVoucherProductOpen(true)
  }

  const vouchersCart = useMemo(() => {
    return searchVoucher
      ? listVoucherCart.filter(voucher => voucher.code.toLowerCase().includes(searchVoucher.toLowerCase()))
      : listVoucherCart
  }, [searchVoucher, listVoucherCart])
  const vouchersProduct = useMemo(() => {
    return searchVoucherProduct
      ? listVoucherProduct.filter(voucher => voucher.code.toLowerCase().includes(searchVoucher.toLowerCase()))
      : listVoucherProduct
  }, [searchVoucherProduct, listVoucherProduct])

  useEffect(() => {
    const total = orderDetails.reduce((acc, cur) => {
      let itemTotal = cur.oldPrice * cur.quantity
      if (cur.voucherUsed.length > 0) {
        let voucher = cur.voucherUsed[0]
        let discount = ((cur.oldPrice * voucher.voucherPercent) / 100) * cur.quantity
        if (discount > voucher.maxDiscount) {
          itemTotal -= voucher.maxDiscount
        } else {
          itemTotal -= discount
        }
      }
      return acc + itemTotal
    }, 0)
    const quantity = orderDetails.reduce((acc, cur) => acc + cur.quantity, 0)
    setTotalQuantityOrder(quantity)
    setTotalMoney(total)
    setReceivedMoney(total)
    getArrCalculate5ReceivedMoney(total)
  }, [orderDetails])

  useEffect(() => {
    if (voucherCart.voucherPercent !== 0) {
      getArrCalculate5ReceivedMoney(totalMoney * (1 - voucherCart.voucherPercent / 100))
    }
  }, [voucherCart])

  useEffect(() => {
    const isMergerVoucher = Array.isArray(voucherProduct?.product) && voucherProduct?.product.includes(orderItem?.id)
    if (!isMergerVoucher && voucherProduct.voucherId !== '') {
      voucherProduct?.voucherId && Notification('error', 'Voucher', 'Voucher cannot be used with this product!!!')
    } else if (isMergerVoucher && orderItem) {
      dispatch(
        updateOrder({
          key: activeKey,
          status: 'change',
          orderDetail: { id: orderItem?.id },
          id: orderItem?.id,
          name: orderItem?.name,
          oldPrice: orderItem?.price,
          price: orderItem?.oldPrice * (1 - (voucherProduct?.voucherPercent || 0) / 100),
          costPrice: orderItem?.costPrice,
          quantity: orderItem?.quantity,
          note: '',
          voucherUsed: voucherProduct
            ? [
                {
                  voucherId: voucherProduct.voucherId,
                  voucherPercent: voucherProduct.voucherPercent,
                  maxDiscount: voucherProduct.maxDiscount
                }
              ]
            : []
        })
      )
    }
  }, [voucherProduct, orderItem])

  const handleOnClearVoucherProduct = () => {
    dispatch(
      updateOrder({
        key: activeKey,
        status: 'change',
        orderDetail: { id: orderItem?.id },
        id: orderItem?.id,
        name: orderItem?.name,
        oldPrice: orderItem?.price,
        price: orderItem?.oldPrice,
        costPrice: orderItem?.costPrice,
        quantity: orderItem?.quantity,
        note: '',
        voucherUsed: []
      })
    )
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  const handleOnChangeVoucherProduct = (value, option) => {
    setSelectedVoucherProduct(value)
    setVoucherProduct({
      voucherId: value?.value ?? '',
      voucherPercent: option?.percent ?? 0,
      product: option?.product ?? [],
      maxDiscount: option?.maxDiscount ?? 0
    })
  }
  const TotalMoneyWithDiscount = useMemo(() => {
    if (voucherCart && voucherCart.voucherPercent && voucherCart.maxDiscount) {
      const discount = totalMoney * (voucherCart.voucherPercent / 100)
      return totalMoney - Math.min(discount, voucherCart.maxDiscount)
    }
    return totalMoney
  }, [totalMoney, voucherCart])

  const discountMoney = useMemo(() => {
    if (voucherCart && voucherCart.voucherId) {
      const discount = totalMoney * (voucherCart.voucherPercent / 100)
      return Math.min(discount, voucherCart.maxDiscount)
    }
    return 0
  }, [voucherCart, totalMoney])

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
        style={{ position: 'fixed', bottom: 0, right: 0, margin: 0, padding: 0 }}
        okText="Save"
        width={1200}
        onOk={handlePayment}
        confirmLoading={isLoadingCreateOrder}
        onCancel={onClose}
        centered
        okButtonProps={{ loading: isLoadingCreateOrder }}
        cancelButtonProps={{ disabled: isLoadingCreateOrder }}
      >
        <Spin spinning={isLoadingCreateOrder}>
          <div className="w-full h-[83vh]">
            <div className="flex gap-10">
              <div className="w-[60%]">
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
                    <div
                      key={order.id}
                      className="px-1 bg-white w-full rounded-md cursor-pointer"
                      onClick={() => handleOpenVoucherProductModal(order)}
                    >
                      <div className="w-full grid grid-cols-12 gap-2 font-medium">
                        <div className="col-span-1">{orderDetails.indexOf(order) + 1}</div>
                        <div className="col-span-5 flex items-center">{order.name}</div>
                        <div className="col-span-2 text-center">{order.quantity}</div>
                        <div className="col-span-2 whitespace-nowrap text-end">
                          <div className="flex flex-col">
                            <div className="whitespace-nowrap">
                              <span className="line-through">{currencyFormatter(order.oldPrice, '')} </span>
                              {order.voucherUsed?.[0]?.voucherPercent && (
                                <span className="bg-b-green w-max text-t-white px-1 rounded-md">
                                  {(order.voucherUsed?.[0]?.voucherPercent || 0) + '%'}
                                </span>
                              )}
                            </div>
                            <div className="underline whitespace-nowrap">{currencyFormatter(order.price, '')}</div>
                          </div>
                        </div>
                        <div className="col-span-2 whitespace-nowrap text-end">
                          <div className="flex flex-col">
                            <div className="line-through whitespace-nowrap">
                              {currencyFormatter(order.oldPrice * order.quantity, '')}
                            </div>
                            <div className="underline whitespace-nowrap">
                              {currencyFormatter(
                                order.voucherUsed &&
                                  ((order.oldPrice * (order.voucherUsed?.[0]?.voucherPercent || 0)) / 100) *
                                    order.quantity >
                                    order.voucherUsed?.[0]?.maxDiscount
                                  ? order.oldPrice * order.quantity - order.voucherUsed?.[0]?.maxDiscount
                                  : order.price * order.quantity,
                                ''
                              )}
                            </div>
                          </div>
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
                      {voucherCart.voucherId ? voucherCart.voucherPercent + '%' : 0}
                    </span>
                  </div>
                  <Input
                    className={`!border-none !outline-none !w-max !bg-red text-right pr-0 w-40 font-bold `}
                    value={voucherCart.voucherId ? currencyFormatter(discountMoney, '') : 0}
                    onClick={handleOpenVoucherModal}
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
                    className={`!border-none !outline-none !w-max !bg-red text-right pr-0 w-20 font-bold ${
                      receivedMoney - TotalMoneyWithDiscount < 0 ? 'text-red-500' : ''
                    }`}
                    onChange={handleInputChange}
                    value={receivedMoney ? receivedMoney : TotalMoneyWithDiscount}
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
        title="Voucher Cart"
        open={isModalVoucherOpen}
        okText="Submit"
        width={400}
        onOk={handleCloseVoucherModal}
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
          allowClear
          loading={isLoadingVoucherCart}
          filterOption={false}
          onChange={(value, option) =>
            setVoucherCart({
              voucherId: value,
              voucherPercent: option?.percent ?? 0,
              maxDiscount: option?.maxDiscount ?? 0
            })
          }
          onSearch={setSearchVoucherProduct}
          options={vouchersCart?.map(voucher => ({
            label:
              voucher.name +
              '-' +
              voucher.code +
              ` - ${voucher.voucherPercent}%` +
              ` - ${currencyFormatter(totalMoney * (voucher.voucherPercent / 100))}`,
            value: voucher._id,
            percent: voucher.voucherPercent ?? 0,
            maxDiscount: voucher.maxDiscount ?? 0
          }))}
        />
      </Modal>

      <Modal
        title="Voucher Product"
        open={isModalVoucherProductOpen}
        okText="Submit"
        width={400}
        onOk={handleCloseVoucherProductModal}
        confirmLoading={isLoadingCreateOrder}
        onCancel={handleCloseVoucherProductModal}
        centered
        okButtonProps={{ loading: isLoadingCreateOrder }}
        cancelButtonProps={{ disabled: isLoadingCreateOrder }}
      >
        <Select
          className="w-full"
          labelInValue
          showSearch
          allowClear
          value={selectedVoucherProduct}
          onClear={handleOnClearVoucherProduct}
          loading={isLoadingVoucherProduct}
          filterOption={false}
          onChange={(value, option) => handleOnChangeVoucherProduct(value, option)}
          onSearch={setSearchVoucher}
          options={vouchersProduct?.map(voucher => ({
            label:
              voucher.name +
              '-' +
              voucher.code +
              ` - ${voucher.voucherPercent}%` +
              ` - ${currencyFormatter((orderItem.oldPrice || 0) * (voucher.voucherPercent / 100))}`,
            value: voucher._id,
            percent: voucher.voucherPercent ?? 0,
            product: voucher.productId ?? [],
            maxDiscount: voucher.maxDiscount ?? 0
          }))}
        />
      </Modal>
    </>
  )
}

export default OrderPaymentModal
