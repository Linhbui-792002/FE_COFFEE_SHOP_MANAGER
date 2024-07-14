import { useEffect, useMemo, useState } from 'react'
import ProductItem from './product-item'
import { useSelector } from 'react-redux'
import { useSearchProductByEmployeeQuery } from '@src/redux/endPoint/product'
import { Spin } from 'antd'
import { useGetAllMenuPublicForEmployeeQuery } from '@src/redux/endPoint/menu'
import { getUniqueMenuInfo, getUniqueProducts } from '@src/utils'
import { useDebounce } from '@src/hooks'



const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [param, setParam] = useState({
    menuInfoId: '',
  })
  const debouncedParamData = useDebounce(param, 500)
  const {data:listMenu, isLoading:isLoadingMenu} = useGetAllMenuPublicForEmployeeQuery(debouncedParamData)
  const {data:listMenuInfo, isLoading:isLoadingMenuInfo} = useGetAllMenuPublicForEmployeeQuery()
  console.log(listMenu,"listMenu")
  const menuInfos = useMemo(() => listMenuInfo?.metadata && getUniqueMenuInfo(listMenuInfo.metadata), [listMenuInfo]);
  const products = useMemo(() => listMenu?.metadata && getUniqueProducts(listMenu.metadata), [listMenu]);


  const handleCategorySelect = categoryId => {
    setSelectedCategory(categoryId)
    setParam({...param,menuInfoId:categoryId})
  }

  return (
    <Spin spinning={false}>
      <div className="flex flex-row gap-3 font-medium items-center cursor-pointer mb-2">
        {menuInfos?.map(category => (
          <div
            key={category._id}
            className={`mb-2 ${
              selectedCategory === category._id
                ? 'bg-[#1677ff] px-3 py-1 rounded-2xl text-white'
                : 'bg-white px-3 py-1 rounded-2xl text-black'
            }`}
            onClick={() => handleCategorySelect(category?._id)}
          >
            {category?.name}
          </div>
        ))}
      </div>
      <Spin spinning={isLoadingMenu}>
      <div className="grid grid-cols-12 gap-1 min-h-[65vh] max-h-[65vh] h-full overflow-y-auto px-1 py-3">
        {products &&
          products.map(product => (
            <ProductItem key={product._id} className="col-span-3" product={product} isLoadingMenu={isLoadingMenu} />
          ))}
      </div>
      </Spin>
    </Spin>
  )
}

export default ProductList
