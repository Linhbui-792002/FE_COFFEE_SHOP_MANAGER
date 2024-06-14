import { updateOrder, addOrder } from '@src/redux/slices/orderSlice'
import { List, Skeleton, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const ProductCard = ({ product, loading, isList }) => {
  const keyActive = useSelector(state => state.order.keyOrderActive)
  const listOrder = useSelector(state => state.order.listOrder)
  const orderDetail = useSelector(state => state.order.orderDetail)
  const dispatch = useDispatch()


  const handleChooseProduct = () => {
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
            id: product?.id,
            name: product?.name,
            price: product?.price,
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
            id: product?.id,
            name: product?.name,
            price: product?.price,
            quantity: 1,
            note: ''
          }
        })
      )
    }
  }

  return isList ? (
    <List
      itemLayout="horizontal"
      dataSource={[
        {
          title: ''
        }
      ]}
      onClick={handleChooseProduct}
      renderItem={(item, index) => (
        <Skeleton loading={loading} avatar active>
          <List.Item>
            <List.Item.Meta
              avatar={<img alt={product.name} src={product.image} className="h-[50px] object-cover" />}
              title={product.name}
              description={product.price.toLocaleString() + ' vnđ'}
            />
          </List.Item>
        </Skeleton>
      )}
    />
  ) : (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.image} className="h-[150px] object-cover" />}
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
