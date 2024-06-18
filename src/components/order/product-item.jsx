import { updateOrder, addOrder } from '@src/redux/slices/orderSlice'
import { List, Skeleton, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import CustomImage from '../common/custom-image'
import { currencyFormatter } from '@src/utils'

const ProductCard = ({ product, loading, isList }) => {
  const keyActive = useSelector(state => state.order.keyOrderActive)
  const listOrder = useSelector(state => state.order.listOrder)
  const orderDetail = useSelector(state => state.order.orderDetail)
  const dispatch = useDispatch()

  const handleChooseProduct = () => {
    alert('test')
    const existingOrderIndex = listOrder.findIndex(order => order.key === keyActive)

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
            price: product?.price,
            costPrice: product?.costPrice,
            quantity: 1,
            note: ''
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
            price: product?.price,
            costPrice: product?.costPrice,
            quantity: 1,
            note: ''
          }
        })
      )
    }
  }

  return isList ? (
    <List
      onClick={handleChooseProduct}
      itemLayout="horizontal"
      dataSource={[
        {
          title: ''
        }
      ]}
      renderItem={(item, index) => (
        <Skeleton loading={loading} avatar active>
          <List.Item>
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
      )}
    />
  ) : (
    <Card
      hoverable
      cover={
        <CustomImage
          // onLoad={isLoading}
          height={400}
          width={400}
          src={`${process.env.PUBLIC_IMAGE_API_BASE_URL}/${product?.image}`}
          alt={product.name}
          className="h-[150px] object-cover min-w-[180px]"
        />
      }
      className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
      loading={loading}
      onClick={handleChooseProduct}
    >
      <Skeleton loading={loading} avatar active>
        <Card.Meta
          title={product.name}
          description={product.price.toLocaleString() + ' vnđ'}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        />
      </Skeleton>
    </Card>
  )
}

export default ProductCard
