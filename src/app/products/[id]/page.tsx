import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageSubTitle from "@/components/ui/page-subTitle";
import PageTitle from "@/components/ui/page-title";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { APP_URL } from "@/constants/navigation.constant";
import { getProduct } from "@/services/server/payload/products.service";
import { getUserServer } from "@/services/server/payload/users.service";
import { formatPriceToVND } from "@/utils/util.utls";
import { notFound } from "next/navigation";
import { IoCardOutline, IoPricetagOutline, IoSync } from "react-icons/io5";
import ProductAddToCart from "./_components/product-add-to-cart";
import ProductBuyNow from "./_components/product-buy-now";
import QuantityOptions from "./_components/product-quantity-option";
import ProductReviewQuantity from "./_components/product-review-quantity";
import ProductReviews from "./_components/product-reviews";
import ProductSlider from "./_components/product-slider";
import ProductBenefits from "./_components/product-benefits";
import ProductDescription from "./_components/product-description";
import ProductPrice from "./_components/product-price";
import ProductSkeleton from "./_components/product-skeleton";

const ProductPage = async ({
  searchParams,
  params: { id },
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) => {
  const user = await getUserServer();
  const { data: product } = await getProduct({ id });
  if (!product) notFound();
  const currentQuantityOptionParams = searchParams?.currentQuantityOption;
  const currentQuantityOption =
    // do not allow buy above 16kg in the app
    currentQuantityOptionParams &&
    +currentQuantityOptionParams > 0 &&
    +currentQuantityOptionParams < 16
      ? Number(currentQuantityOptionParams)
      : 1;
      // return <ProductSkeleton />
  return (
    <>
      
      <PageTitle data-cy='product-title' className='mb-2'>
        {product.title} ({currentQuantityOption}KG)
      </PageTitle>
      <div className='flex gap-2'>
        <ReviewRating ratingAverage={5} />
        <ProductReviewQuantity />
      </div>
      <div className='mt-6'>
        <ProductSlider imgs={product.productImgs} />
        <QuantityOptions
          currentOption={!currentQuantityOption ? 1 : currentQuantityOption}
          options={product.quantityOptions}
        />
        <ProductPrice
          priceAfterDiscount={product.priceAfterDiscount}
          originalPrice={product.originalPrice}
          currentQuantityOption={currentQuantityOption}
        />
        <ProductBuyNow quantity={currentQuantityOption} productId={product.id} />
        <ProductAddToCart
          user={user}
          product={{ ...product, quantity: currentQuantityOption }}
        />
        <ProductDescription />
      </div>
      <div className='mt-6'>
        <PageSubTitle>Sản phẩm liên quan</PageSubTitle>
        <ul className=''></ul>
      </div>
      <div>
        <ProductBenefits />

        {/* Reviews */}
        {/* TODO: load on request time */}
        {/* use <Suspend />> */}
        {/* <ProductReview productId={product.id} title={product.title} imgSrc={product.thumbnailImg}/> */}
        <ProductReviews
          productImgSrc={product.thumbnailImg}
          productTitle={product.title}
          productId={product.id}
          user={user}
        />
      </div>
      {/* <ProductPrice price={product.originalPrice} /> */}
    </>
  );
};

export default ProductPage;
