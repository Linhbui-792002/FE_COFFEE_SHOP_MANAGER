import { updateOrder, addOrder } from '@src/redux/slices/orderSlice'
import { List, Skeleton, Card, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import CustomImage from '../common/custom-image'
import { currencyFormatter } from '@src/utils'

const ProductItem = ({ className, product, loading, isList }) => {
  const keyActive = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()

  const handleChooseProduct = () => {
    if (keyActive == undefined || keyActive == null) {
      const newKey = 1
      dispatch(
        addOrder({
          key: newKey,
          label: `Order-${newKey}`,
          orderDetail: []
        })
      )
      dispatch(
        updateOrder({
          key: newKey,
          status: 'up',
          orderDetail: {
            id: product?._id,
            name: product?.name,
            oldPrice: product?.price,
            price: product?.price,
            costPrice: product?.costPrice,
            quantity: 1,
            note: '',
            voucherUsed: []
          }
        })
      )
    } else {
      dispatch(
        updateOrder({
          key: keyActive,
          status: 'up',
          orderDetail: {
            id: product?._id,
            name: product?.name,
            oldPrice: product?.price,
            price: product?.price,
            costPrice: product?.costPrice,
            quantity: 1,
            note: '',
            voucherUsed: []
          }
        })
      )
    }
  }

  return isList ? (
    <Skeleton loading={loading} avatar active>
      <List.Item
        onClick={handleChooseProduct}
        className="px-4 cursor-pointer border
          border-gray-200 hover:bg-gray-100
          hover:text-gray-900 transition duration-300 ease-in-out bg-white
           rounded"
      >
        <List.Item.Meta
          avatar={
            <CustomImage
              // onLoad={isLoading}
              height={400}
              width={400}
              src={`${process.env.PUBLIC_IMAGE_API_BASE_URL}/${product?.image}`}
              alt={product.name}
              className="h-[50px] w-[50px] object-cover"
            />
          }
          title={product.name}
          description={currencyFormatter(product?.price)}
        />
      </List.Item>
    </Skeleton>
  ) : (
    <Card
      hoverable
      cover={
        <CustomImage
          // onLoad={isLoading}
          height={200}
          width={200}
          src={`${process.env.PUBLIC_IMAGE_API_BASE_URL}/${product?.image}`}
          alt={product.name}
         className="w-full h-auto object-center"
        />
      }
      className={
        className +
        ' min-h-[18rem] h-max shadow-lg rounded-lg overflow-hidden transition-transform transform scale-95 hover:scale-100'
      }
      loading={loading}
      onClick={handleChooseProduct}
    >
      <Skeleton loading={loading} avatar active>
        <Card.Meta
          title={product.name}
          description={
            <div className="w-full flex flex-col gap-1 ">
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="text-t-black font-medium underline">{currencyFormatter(product?.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <Tag color={product?.isCombo ? 'gold' : 'red'} className="w-max !m-0">
                  {product?.isCombo ? 'Combo' : 'Product'}
                </Tag>
              </div>
            </div>
          }
          className="!flex flex-col"
        />
      </Skeleton>
    </Card>
  )
}

export default ProductItem
