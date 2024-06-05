import { updateOrder } from '@src/redux/slices/orderSlice'
import { List, Skeleton, Card } from 'antd'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ProductCard = ({ product, loading, isList }) => {
  console.log(product, 'product')
  const keyActive = useSelector(state => state.order.keyOrderActive)
  const dispatch = useDispatch()
  const handleChooseProduct = () => {
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
