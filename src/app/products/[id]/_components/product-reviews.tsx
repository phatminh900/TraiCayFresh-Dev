import ProductReview from "@/components/molecules/product-review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageSubTitle from "@/components/ui/page-subTitle";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { Product } from "@/payload/payload-types";
import { getUserOrdersNoPopulate } from "@/services/server/payload/orders.service";
import { IUser } from "@/types/common-types";
import { IoStar } from "react-icons/io5";

const reviewFilter: { label: string; option: string }[] = [
  { label: "Tất cả", option: "" },
  { label: "5", option: "5" },
  { label: "4", option: "4" },

  { label: "3", option: "3" },

  { label: "2", option: "2" },

  { label: "1", option: "1" },
];
interface ProductReviewsProps extends IUser {
  productId: string;
  productTitle: string;
  productImgSrc: Product["thumbnailImg"];
}
const ProductReviews = async ({
  user,
  productId,
  productImgSrc,
  productTitle,
}: ProductReviewsProps) => {
  let hasBoughtProduct = false;
  if (user) {
    const { data } = await getUserOrdersNoPopulate({ userId: user.id });
    if (!data) hasBoughtProduct = false;
    const userOrders = data?.orders;
    if (!userOrders) hasBoughtProduct = false;
    if (
      userOrders?.some(
        (order) =>
          {
          return order._isPaid && order.items.find((item) => item.product === productId)
          
          }
      )
    ) {
      hasBoughtProduct = true;
    }
  }
  // TODO: is loading
  console.log('--------')
  console.log(hasBoughtProduct);
  return (
    <div id='reviews' className='mt-12'>
      <PageSubTitle className='mb-2'>Đánh giá sản phẩm:</PageSubTitle>
      {hasBoughtProduct && (
        <>
          <div>
            <p className='font-semibold text-center mb-4'>
              Cảm ơn bạn đã mua hàng gửi đánh giá giúp bọn mình nhé
            </p>
          </div>

          <div className='flex justify-center mb-6'>
            <ProductReview
            userId={user?.id}
              productId={productId}
              title={productTitle}
              imgSrc={productImgSrc}
            />
          </div>
        </>
      )}
      {/* filter */}
      <ul className='flex flex-wrap gap-2'>
        {reviewFilter.map((filter, i) => (
          <li className='flex-1' key={filter.label}>
            <button className='whitespace-nowrap w-full text-sm px-2 py-1.5 flex-center gap-1.5 border rounded-sm hover:border-primary'>
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
      <ProductReviewDetails />
    </div>
  );
};

export default ProductReviews;

function ProductReviewDetails() {
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
