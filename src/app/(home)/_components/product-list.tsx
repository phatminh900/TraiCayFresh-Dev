import ProductItem from "@/components/molecules/product-item";
import { APP_URL } from "@/constants/navigation.constant";
import { Product } from "@/payload/payload-types";
import { getUserServer } from "@/services/auth.service";
import { getImgUrlMedia } from "@/utils/util.utls";
import { cookies } from "next/headers";

interface ProductListProps {
  products: Product[];
}
const ProductList = async ({ products }: ProductListProps) => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  return (
    <ul className='space-y-4'>
      {products?.map((product) => {
        const productImg = getImgUrlMedia(product.thumbnailImg);

        return (
          <ProductItem
            user={user}
            id={product.id}
            priceAfterDiscount={product.priceAfterDiscount}
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

export default ProductList;
