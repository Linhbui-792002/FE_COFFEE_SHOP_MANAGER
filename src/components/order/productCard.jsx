import { updateOrder, addOrder } from '@src/redux/slices/orderSlice'
import { List, Skeleton, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const ProductCard = ({ product, loading, isList }) => {
  const keyActive = useSelector(state => state.order.keyOrderActive)
  const listOrder = useSelector(state => state.order.listOrder)
  const dispatch = useDispatch()

  const handleChooseProduct = () => {
    const existingOrderIndex = listOrder.findIndex(order => order.key === keyActive)

    if (existingOrderIndex !== -1) {
      const existingProductIndex = listOrder[existingOrderIndex].orderDetail.findIndex(item => item.id === product.id)

      if (existingProductIndex !== -1) {
        dispatch(
          updateOrder({
            key: keyActive,
            orderDetail: {
              ...listOrder[existingOrderIndex].orderDetail[existingProductIndex],
              quantity: listOrder[existingOrderIndex].orderDetail[existingProductIndex].quantity + 1
            }
          })
        )
      } else {
        dispatch(
          updateOrder({
            key: keyActive,
            orderDetail: {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              note: ''
            }
          })
        )
      }
    } else {
      const newKey = listOrder.length === 0 ? 1 : listOrder[listOrder.length - 1].key + 1

      dispatch(
        addOrder({
          key: newKey,
          label: `Order-${newKey}`,
          orderDetail: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              note: ''
            }
          ]
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
