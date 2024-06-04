import { List, Skeleton, Card } from 'antd'

const ProductCard = ({ product, loading, isList }) =>
  isList ? (
    <List
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

export default ProductCard
