import { useEffect, useMemo, useState } from 'react'
import ProductItem from './product-item'
import { useSelector } from 'react-redux'
import { useSearchProductByEmployeeQuery } from '@src/redux/endPoint/product'

const MOCK_PRODUCT = [
  {
    _id: '666ecb585f833c5fd68dd21f',
    categoryId: '666ec7f8367ab979a1b9cab3',
    name: 'Sample product combo',
    detail: 'This is a detailed description of the sample product.',
    isCombo: false,
    productCombo: [],
    costPrice: 10.99,
    price: 15.99,
    image: 'sample-product-image.jpg',
    quantity: 100,
    status: true,
    createdAt: {
      $date: '2024-06-16T11:24:08.510Z'
    },
    updatedAt: {
      $date: '2024-06-16T11:24:08.510Z'
    },
    __v: 0
  },
  {
    _id: '666ecc64c958dd3ccd4098ac',
    categoryId: '666ec7f8367ab979a1b9cab3',
    name: 'Sample product1',
    detail: 'This is a detailed description of the sample product.',
    isCombo: false,
    productCombo: [],
    costPrice: 10.99,
    price: 15.99,
    image: 'sample-product-image.jpg',
    quantity: 100,
    status: true,
    createdAt: {
      $date: '2024-06-16T11:28:36.355Z'
    },
    updatedAt: {
      $date: '2024-06-16T11:28:36.355Z'
    },
    __v: 0
  },
  {
    _id: '666ecc64c958dd3ccd4098a2',
    categoryId: '666ec7f8367ab979a1b9cab3',
    name: 'Sample product2',
    detail: 'This is a detailed description of the sample product.',
    isCombo: false,
    productCombo: [],
    costPrice: 10.99,
    price: 15.99,
    image: 'sample-product-image.jpg',
    quantity: 100,
    status: true,
    createdAt: {
      $date: '2024-06-16T11:28:36.355Z'
    },
    updatedAt: {
      $date: '2024-06-16T11:28:36.355Z'
    },
    __v: 0
  }
]

const MOCK_CATEGORY = [
  {
    id: 0,
    name: 'Tất cả'
  },
  {
    id: 1,
    name: 'Cà phê'
  },
  {
    id: 2,
    name: 'Trà sữa'
  }
]

const ProductList = () => {
  const [loading, setLoading] = useState(false)
  const [productCards, setProductCards] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(0)

  const getProducts = () => {
    setProductCards(MOCK_PRODUCT)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const getCategories = () => {
    setProductCategories(MOCK_CATEGORY)
  }

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  const handleCategorySelect = categoryId => {
    setSelectedCategory(categoryId)
  }

  return (
    <>
      <div className="flex flex-row gap-3 font-medium items-center cursor-pointer mb-2">
        {productCategories?.map(category => (
          <div
            key={category.id}
            className={`mb-2 ${
              selectedCategory === category.id
                ? 'bg-[#1677ff] px-3 py-1 rounded-2xl text-white'
                : 'bg-white px-3 py-1 rounded-2xl text-black'
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap max-h-[65vh] overflow-y-auto pl-5 py-3">
        {productCards &&
          productCards.map(product => <ProductItem key={product._id} product={product} loading={loading} />)}
      </div>
    </>
  )
}

export default ProductList
