import { useEffect, useMemo, useState } from 'react'
import ProductCard from './productCard'
import { useSelector } from 'react-redux'

const MOCK_PRODUCT = [
  {
    id: 1,
    category: 1,
    name: 'Cà phê đen',
    price: 15000,
    image: 'https://via.placeholder.com/150',
    description: 'Cà phê đen'
  },
  {
    id: 2,
    category: 1,
    name: 'Cà phê sữa',
    price: 20000,
    image: 'https://via.placeholder.com/150',
    description: 'Cà phê sữa'
  },
  {
    id: 3,
    category: 2,
    name: 'Trà sữa',
    price: 20000,
    image: 'https://via.placeholder.com/150',
    description: 'Trà sữa'
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

const ProductList = ({ searchTerm, isList }) => {
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

  const filteredProducts =
    selectedCategory === 0 ? productCards : productCards.filter(product => product.category === selectedCategory)

  const searchedProducts = searchTerm
    ? filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredProducts

  return (
    <div>
      {!isList && (
        <div className="flex flex-row gap-3 font-medium items-center cursor-pointer mb-4">
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
      )}

      <div className={!isList && 'flex gap-2 flex-wrap'}>
        {searchedProducts &&
          searchedProducts?.map(product => (
            <ProductCard key={product.id} product={product} loading={loading} isList={isList} />
          ))}
      </div>
    </div>
  )
}

export default ProductList
