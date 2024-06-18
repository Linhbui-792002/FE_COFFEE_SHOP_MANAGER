import { Avatar, Card, Tag } from 'antd'
import React, { useState } from 'react'
import CustomImage from '../common/custom-image'
import { currencyFormatter } from '@src/utils'
import TooltipCustom from '../common/tooltip'
import Notification from '../common/notification'
import Confirm from '../common/confirm'
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import ProductForm from './product-form'
import { useChangeStatusProductMutation } from '@src/redux/endPoint/product'

const ChangeStatusProduct = ({ product }) => {
  const [changeStatusProduct] = useChangeStatusProductMutation()

  const handleChangeStatus = async () => {
    try {
      const body = {
        productId: product?._id,
        status: !product.status
      }
      await changeStatusProduct(body).unwrap()
      Notification('success', 'Product Manager', `${product?.status ? 'Public' : 'Draft'} successfully`)
    } catch (error) {
      Notification('error', 'Product Manager', 'Failed call api')
    }
  }
  return (
    <Confirm
      icon={
        !product?.status ? (
          <LockKeyhole className="m-auto text-t-red" />
        ) : (
          <LockKeyholeOpen className="m-auto text-t-green" />
        )
      }
      title={!product?.status ? 'Public product' : 'Draff product'}
      color={!product?.status ? 'green' : 'red'}
      type="text"
      message={`Are you sure you want to ${!product?.status ? 'Public' : 'Draft'} product ${product?.name}?`}
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
        <ChangeStatusProduct product={item} key="changeStatus" />,
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
