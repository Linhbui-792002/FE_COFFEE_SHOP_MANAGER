import { Breadcrumb, Spin } from 'antd'
import { Home, ScrollText } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProductCategoryTable from './produc_category-table'
import { useGetAllProductCategoryQuery } from '@src/redux/endPoint/productCategory'
import ProductCategoryForm from './product_category_form'

const ProductCategory = () => {
  const { data: productCategories, isLoading: isLoadingProductCategories } = useGetAllProductCategoryQuery()

  return (
    <Spin spinning={isLoadingProductCategories}>
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
                <ScrollText size={18} /> Product Category
              </span>
            )
          }
        ]}
      />
      <div className="bg-b-white rounded-md mt-4">
        <div className="flex justify-between items-center py-4 px-4">
          <h1 className="text-2xl font-normal">Product Category Manager</h1>
          <ProductCategoryForm title="Add new product category" label="New product category" />
        </div>
        <div className="px-4 py-5 mt-12">
          <ProductCategoryTable categories={productCategories} className={'m-6'} />
        </div>
      </div>
    </Spin>
  )
}

export default ProductCategory
