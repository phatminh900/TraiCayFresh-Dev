"use client";
import PageSubTitle from "@/components/ui/page-subTitle";
import React, { useEffect } from "react";
import ProductReviewDetails from "./product-review-details";
import ButtonAdjust from "@/components/atoms/button-adjust";
import ButtonDelete from "@/components/atoms/button-delete";
import { Product, Review } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { useRouter } from "next/navigation";
import { handleTrpcSuccess } from "@/utils/success.util";
import { cn } from "@/lib/utils";
import ProductModifyReview from "@/components/molecules/product-modify-review";
import { IUser } from "@/types/common-types";
import useDisableClicking from "@/hooks/use-disable-clicking";


export interface IUserReview{
  userRating:Review['rating'],
  userReviewImgs:Review['reviewImgs'],
  userReviewText:Review['reviewText']
}

interface ProductReviewOfUserProps extends IUser,IUserReview {
  userName: string;
  reviewId: string;
  productThumbnailImg: Product["thumbnailImg"];
  title: Product["title"];
  productId: string;
}
const ProductReviewOfUser = ({
  userName,
  productId,
  user,
  userRating,userReviewImgs,userReviewText,
  productThumbnailImg,
  title,
  reviewId,
}: ProductReviewOfUserProps) => {
  const { handleSetMutatingState } = useDisableClicking();
  const router = useRouter();

  const { isPending: isDeletingReview, mutate: deleteReview } =
    trpc.review.deleteReview.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => handleTrpcSuccess(router, data?.message),
    });

  const isMutating = isDeletingReview;
  useEffect(() => {
    if (isMutating) {
      handleSetMutatingState(true);
    }
    if (!isMutating) {
      handleSetMutatingState(false);
    }
  }, [isMutating, handleSetMutatingState]);
  return (
    <div className='mt-4 mb-6'>
      <PageSubTitle className='mb-2 text-sm'>Đánh giá của bạn:</PageSubTitle>
      <div className='mt-4'>
        <ProductReviewDetails name={userName} review={userReviewText} />
        <div className='grid grid-cols-[40px_1fr] gap-4'>
          <div></div>
          <div
            className={cn("flex gap-4 mt-2", {
              "mt-3": userReviewText,
            })}
          >
            <ProductModifyReview
              imgSrc={productThumbnailImg}
              productId={productId}
              userRating={userRating}
              userReviewImgs={userReviewImgs}
              userReviewText={userReviewText}
              user={user}
              title={title}
              type={"adjust"}
            />
            {/* <ButtonAdjust onClick={()=>{}} disabled={false} /> */}
            <ButtonDelete
              onClick={() => {
                deleteReview({ reviewId });
              }}
              disabled={isMutating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewOfUser;
