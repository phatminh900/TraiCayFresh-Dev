import ProductItem from "@/components/molecules/product-item";
import { APP_URL } from "@/constants/navigation.constant";
import { Product } from "@/payload/payload-types";
import { IUser } from "@/types/common-types";
import { getImgUrlMedia } from "@/utils/util.utls";

interface RelativeProductsProps extends IUser {
  products: Product["relativeProducts"];
}
const RelativeProducts = ({ products, user }: RelativeProductsProps) => {
  return (
    <ul className='space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6 xl:grid-cols-3 xl:gap-x-4'>
      {products?.map((productItem) => {
        const product = productItem as Product;
        const productImg = getImgUrlMedia(product.thumbnailImg);
        return (
          <ProductItem
            productType='relativeProduct'
            user={user}
            id={product.id}
            priceAfterDiscount={product?.priceAfterDiscount}
            href={`${APP_URL.products}/${product.id}`}
            src={productImg || ""}
            key={product.id}
            title={product.title}
            subTitle={`(${product.estimateQuantityFor1Kg})`}
            originalPrice={product.originalPrice}
            reviewQuantity={0}
            reviewRating={5}
          />
        );
      })}
    </ul>
  );
};

export default RelativeProducts;
