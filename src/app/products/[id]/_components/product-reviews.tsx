import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { IoStar } from "react-icons/io5";

const reviewFilter: { label: string; option: string }[] = [
  { label: "Tất cả", option: "" },
  { label: "5", option: "5" },
  { label: "4", option: "4" },

  { label: "3", option: "3" },

  { label: "2", option: "2" },

  { label: "1", option: "1" },
];

const ProductReviews = () => {
  return (
    <div id='reviews' className='mt-8'>
      {/* filter */}
      <ul className='flex flex-wrap gap-2'>
        {reviewFilter.map((filter, i) => (
          <li className="flex-1" key={filter.label}>
            <button className='whitespace-nowrap w-full text-sm px-2 py-1.5 flex justify-center items-center gap-1.5 border rounded-sm hover:border-primary'>
              {i !== 0 ? (
                <>
                  {filter.label} <IoStar className='w-4 h-4 text-secondary' />{" "}
                </>
              ) : (
                filter.label
              )}
            </button>
          </li>
        ))}
      </ul>
      <ProductReview/>
    </div>
  );
};

export default ProductReviews;

function ProductReview() {
  return (
    <div className='flex gap-4 mt-12'>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>
      <div className='pb-2'>
        <div className='mb-4'>
          <p className='font-bold'>Name</p>
          <ReviewRating ratingAverage={5} />
        </div>
        <p className='max-h-[200px] line-clamp-6 overflow-y-hidden text-ellipsis'>
          Review Text so good oh now i can&apos; help eating eat
        </p>
        {/* div imgs  max width max height 180*/}
        
      </div>
    </div>
  );
}
