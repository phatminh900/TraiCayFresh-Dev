'use client'
import PageSubTitle from "@/components/ui/page-subTitle";
import React from "react";
import ProductReviewDetails from "./product-review-details";
import ButtonAdjust from "@/components/atoms/button-adjust";
import ButtonDelete from "@/components/atoms/button-delete";
import { Review } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { useRouter } from "next/navigation";
import { handleTrpcSuccess } from "@/utils/success.util";

interface ProductReviewOfUserProps {
  userName: string;
  reviewText: Review["reviewText"];
  reviewId:string
}
const ProductReviewOfUser = ({
  userName,
  reviewText,
  reviewId
}: ProductReviewOfUserProps) => {
    const router=useRouter()
    const {mutate:deleteReview,isPending:isDeletingReview}=trpc.review.deleteReview.useMutation({
        onError:err=>handleTrpcErrors(err),
        onSuccess:(data)=>{ 
            handleTrpcSuccess(router,data?.message)
        }
    })
    const isMutating=isDeletingReview
  return (
    <div className='mt-4 mb-6'>
      <PageSubTitle className='mb-2 text-sm'>Đánh giá của bạn:</PageSubTitle>
      <div className='mt-4'>
        <ProductReviewDetails name={userName} review={reviewText} />
        <div className="grid grid-cols-[40px_1fr] gap-4">
            <div></div>
        <div className='flex gap-4'>
          <ButtonAdjust onClick={()=>{}} disabled={false} />
          <ButtonDelete onClick={() =>{
            console.log('deleting...')
             deleteReview({reviewId})
          }} disabled={isMutating} /> 
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewOfUser;
