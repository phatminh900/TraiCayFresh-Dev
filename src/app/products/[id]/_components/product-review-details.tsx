'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { Review } from "@/payload/payload-types";

function ProductReviewDetails({
    name,
    review
  }: {
    name: string;
    review: Review["reviewText"];
  }) {
    return (
      <div className='flex gap-4'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>PT</AvatarFallback>
        </Avatar>
        <div >
          <div className='mb-2'>
            <p className='font-bold'>{name}</p>
            <ReviewRating ratingAverage={5} />
          </div>
          <p className='max-h-[200px] line-clamp-6 overflow-y-hidden text-ellipsis'>
            {review}
          </p>
          {/* div imgs  max width max height 180*/}
        </div>
      </div>
    );
  }
export default ProductReviewDetails  