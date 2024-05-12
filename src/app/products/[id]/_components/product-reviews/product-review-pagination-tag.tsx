import { cn } from '@/lib/utils'
import React from 'react'
interface ProductReviewPaginationTagProps{
    index:number,
    active:boolean,
    onSetPagination:(page:number)=>void
}
const ProductReviewPaginationTag = ({onSetPagination,active,index}:ProductReviewPaginationTagProps) => {
  return (
    <li >
    <button onClick={()=>onSetPagination(index)} className={cn('rounded-sm bg-gray-200 h-10 py-2.5 px-3 text-xs border flex items-center hover:border-primary',{
      'border-primary':active
    })}>
        {index}
    </button>
  </li>
  )
}

export default ProductReviewPaginationTag