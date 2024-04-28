import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { IoCardOutline, IoPricetagOutline, IoSync } from "react-icons/io5";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { Button } from "@/components/ui/button";
import PageSubTitle from "@/components/ui/page-subTitle";
import PageTitle from "@/components/ui/page-title";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { APP_URL } from "@/constants/navigation.constant";
import { getProduct } from "@/services/server/payload.service";
import { formatPriceToVND } from "@/utils/util.utls";
import ProductAddToCart from "./_components/product-add-to-cart";
import ProductBuyNow from "./_components/product-buy-now";
import QuantityOptions from "./_components/product-quantity-option";
import ProductReviewQuantity from "./_components/product-review-quantity";
import ProductReviews from "./_components/product-reviews";
import ProductSlider from "./_components/product-slider";
import { getUserServer } from "@/services/server/auth.service";

const ProductPage = async ({
  searchParams,
  params: { id },
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  const {data:product} = await getProduct({ id });
  if (!product) notFound();
  const currentQuantityOptionParams = searchParams?.currentQuantityOption;
  const currentQuantityOption =
    // do not allow buy above 16kg in the app
    currentQuantityOptionParams && +currentQuantityOptionParams < 16
      ? Number(currentQuantityOptionParams)
      : 1;

  return (
    <div>
      <BreadCrumbLinks
        links={[
          { label: product.title, href: `${APP_URL.products}/${product.id}` },
        ]}
      />
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
        <div className='mt-6'>
          <p>Giá:</p>
          <p className='font-bold text-2xl text-destructive'>
            {formatPriceToVND(product.originalPrice * currentQuantityOption)}
          </p>
        </div>
        <ProductBuyNow product={product} />
        <ProductAddToCart
          user={user}
          product={{ ...product, quantity: currentQuantityOption ,}}
        />
        <h4 className='text-lg font-bold mt-6 mb-2'>Mô tả sản phẩm</h4>
        <p className='mb-3'>
          Măng cụt (nữ hoàng trái cây) là 1 loại trái cây với hương vị tươi ngon
          , thanh mát , dịu nhẹ. Không những ngon măng cụt còn có những công
          dụng tuyệt vời.
        </p>
        <div className='border border-gray-800 w-full h-[300px]'></div>
      </div>
      <div className='mt-6'>
        <PageSubTitle>Sản phẩm liên quan</PageSubTitle>
        <ul className=''></ul>
      </div>
      <div>
        <div className='space-y-4 w-full'>
          <div className='flex gap-2 items-center'>
            <div className='flex-center h-10 w-10 rounded-full bg-slate-200'>
              <IoSync className='w-6 h-6 text-primary' />
            </div>
            <p className='text-xs'>
              Đổi sản phẩm mới nếu trái cây bị lỗi (sượng , hư , ...)
            </p>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='flex-center h-10 w-10 rounded-full bg-slate-200'>
              <IoPricetagOutline className='w-6 h-6 text-primary' />
            </div>
            <p className='text-xs'>
              Giá cả hợp lí thay đổi theo nhu cầu của thị trường
            </p>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='flex-shrink-0 flex-center h-10 w-10 rounded-full bg-slate-200'>
              <IoCardOutline className='w-6 h-6 text-primary' />
            </div>
            <p className='text-xs'>
              Miễn phí ship với đơn hàng từ 300K trở lên đối với thanh toán momo
              hoặc chuyển khoản và từ 600K trở lên đối với thanh toán bằng tiền
              mặt
            </p>
          </div>
        </div>

        <div>
          <PageSubTitle className='mb-2'>Đánh giá sản phẩm:</PageSubTitle>
          <p className='font-semibold text-center mb-4'>
            Cảm ơn bạn đã mua hàng gửi đánh giá giúp bọn mình nhé
          </p>
          <div className='flex justify-center'>
            <Button variant={"secondary-outline"}>Gửi đánh giá</Button>
          </div>
        </div>

        {/* Reviews */}
        {/* TODO: load on request time */}
        <ProductReviews />
      </div>
      {/* <ProductPrice price={product.originalPrice} /> */}
    </div>
  );
};

export default ProductPage;
