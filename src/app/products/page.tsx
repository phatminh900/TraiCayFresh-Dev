// 'use client'
import { trpc } from '@/trpc/trpc-client'
import React from 'react'

const Products = async() => {
  // TODO: using local payload
  const {data:products}=trpc.products.getProducts.useQuery()
  console.log(products)
  return (
    <div>Products</div>
  )
}

export default Products