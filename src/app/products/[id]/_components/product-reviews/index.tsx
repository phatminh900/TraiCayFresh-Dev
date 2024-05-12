import ProductModifyReview from "@/components/molecules/product-modify-review";
import PageSubTitle from "@/components/ui/page-subTitle";
import { Product, Review } from "@/payload/payload-types";
import { getUserOrdersNoPopulate } from "@/services/server/payload/orders.service";
import { checkUserHasReviewed } from "@/services/server/payload/reviews.service";
import { IUser } from "@/types/common-types";
import { IoStar } from "react-icons/io5";
import ProductReviewDetails from "./product-review-details";
import ProductReviewOfUser from "./product-reviewed-of-user";
import ProductReviewList from "./product-review-list";


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
  let hasReviewedProduct = false;
  let userReview: Review;
  if (user) {
    // check if user bought the product before
    const { data: userOrder } = await getUserOrdersNoPopulate({
      userId: user.id,
    });
    if (!userOrder) hasBoughtProduct = false;
    const userOrders = userOrder?.orders;
    if (!userOrders) hasBoughtProduct = false;
    if (
      userOrders?.some((order) => {
        return (
          order._isPaid &&
          order.items.find((item) => item.product === productId)
        );
      })
    ) {
      hasBoughtProduct = true;
    }
    // check if user reviewed the product
    const { data: userReviewData } = await checkUserHasReviewed({
      userId: user.id,
      productId,
    });
    if (userReviewData) {
      hasReviewedProduct = true;
      // only 1 review on 1 product per user
      userReview = userReviewData[0];
    }
  }
  // TODO: is loading
  return (
    <div id='reviews' className='mt-12'>
      <PageSubTitle className='mb-2'>Đánh giá sản phẩm:</PageSubTitle>
      {hasBoughtProduct && !hasReviewedProduct && (
        <>
          <div className='mt-6'>
            <p className='font-semibold text-center mb-4'>
              Cảm ơn bạn đã mua hàng gửi đánh giá giúp bọn mình nhé
            </p>
          </div>

          <div className='flex justify-center mb-6'>
            <ProductModifyReview
              user={user}
              productId={productId}
              title={productTitle}
              imgSrc={productImgSrc}
            />
          </div>
        </>
      )}
      {hasReviewedProduct && (
        <ProductReviewOfUser
          productId={productId}
          user={user}
          productThumbnailImg={productImgSrc}
          title={productTitle}
          reviewId={userReview!.id}
          userName={user?.name || `User ${user?.id.slice(-6)}`}
          userReviewText={userReview!.reviewText || ""}
          userReviewImgs={userReview!.reviewImgs}
          userRating={userReview!.rating}
        />
      )}
      {/* filter */}
     
      <ProductReviewList user={user} productId={productId} />
    </div>
  );
};

export default ProductReviews;

