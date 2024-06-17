import { COMBO_PRODUCT, STATUS_PRODUCT } from '@src/constants'
import { useDebounce } from '@src/hooks'
import { Breadcrumb, Empty, Input, Pagination, Select, Spin, Tag } from 'antd'
import { Home, LayoutList, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import ProductItem from './product-item'
import ProductForm from './product-form'
import { useGetAllProductCategoryQuery } from '@src/redux/endPoint/productCategory'
import { useGetAllProductQuery } from '@src/redux/endPoint/product'

const Product = () => {
  const [formFilterData, setFormFilterData] = useState({
    keySearch: '',
    categoryId: '',
    status: '',
    isCombo: '',
  })
  // Debounced formFilterData

  const debouncedFormFilterData = useDebounce(formFilterData, 500)

  const {data: dataProduct, isLoading:isLoadingProduct} = useGetAllProductQuery(debouncedFormFilterData)
  const {data:dataProductCate, isLoading: isLoadingProductCate} = useGetAllProductCategoryQuery()


  const handleChange = (name, value) => {
    setFormFilterData({
      ...formFilterData,
      [name]: value ?? '',
      page: name != 'page'? 1: value
    })
  }

  return (
    <Spin spinning={isLoadingProductCate || isLoadingProduct}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" className="!flex gap-1 items-center w-max">
                {' '}
                <Home size={18} /> Home
              </Link>
            )
          },
          {
            title: (
              <span className="!flex gap-1 items-center w-max">
                <LayoutList size={18} /> Product List
              </span>
            )
          }
        ]}
      />
      <div className="h-full grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-9 bg-b-white rounded-md">
          <h1 className="text-2xl font-normal px-4 py-2">Product Manager</h1>
          <div className="flex justify-end gap-4 p-6">
            <Input
              placeholder="Enter name product"
              prefix={<Search strokeWidth={1.25} />}
              size="middle"
              className="!min-w-44 !max-w-52"
              onChange={e => handleChange('keySearch', e.target.value)}
            />
            <Select
            loading={isLoadingProductCate}
              onChange={value => handleChange('categoryId', value)}
              allowClear={true}
              placeholder="Product Category"
              className="!min-w-36"
              options={dataProductCate?.map(item => ({
                label: <Tag className="w-max !m-0">{item?.name}</Tag>,
                value: item?._id
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('status', value)}
              placeholder="Status"
              className="!min-w-28"
              options={STATUS_PRODUCT.map(item => ({
                label: (
                  <Tag color={item.value ? 'green' : 'gray'} className="w-max !m-0">
                    {item.label}
                  </Tag>
                ),
                value: item.value
              }))}
            />

            <Select
              allowClear={true}
              onChange={value => handleChange('isCombo', value)}
              placeholder="Combo Filter"
              className="!min-w-28"
              options={COMBO_PRODUCT.map(item => ({
                label: (
                  <Tag color={item.value ? 'green' : 'gray'} className="w-max !m-0">
                    {item.label}
                  </Tag>
                ),
                value: item.value
              }))}
            />
          </div>
           <Spin spinning={isLoadingProduct}>
          <div className="w-full grid grid-cols-12 gap-4 p-6">
            {dataProduct?.options?.totalRecords !=0 ? dataProduct?.metadata
              .map((product) => (
                <ProductItem isLoading={isLoadingProduct} key={product?._id} className="col-span-3 !w-full" item={product}/>
              )):<div  className="col-span-12 min-h-[30rem]"><Empty /></div>}
          </div>
          </Spin>

          <div className="col-span-12 my-4 mr-4 flex justify-end">
           {dataProduct?.options?.totalRecords != 0 && <Pagination
              current={dataProduct?.options?.pageIndex}
              total={dataProduct?.options?.totalRecords}
              pageSize={dataProduct?.options?.pageSize}
              onChange={page => handleChange('page', page)}
              className="w-max"
            />}
          </div>
        </div>
        <div className="col-span-3 bg-b-white rounded-md flex flex-col items-end gap-4 p-6">
          <ProductForm label="New product" title="Create product" />
          <div className="flex flex-col gap-3 !w-full"></div>
        </div>
      </div>
    </Spin>
  )
}

export default Product
