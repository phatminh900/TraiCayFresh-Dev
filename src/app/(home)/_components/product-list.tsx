import ProductItem from "@/components/molecules/product-item";
import { APP_URL } from "@/constants/navigation.constant";
import { Product } from "@/payload/payload-types";
import { getUserServer } from "@/services/server/payload/users.service";
import { getImgUrlMedia } from "@/utils/util.utls";

interface ProductListProps {
  products: Product[];
}
const ProductList = async ({ products }: ProductListProps) => {
  const user = await getUserServer();
  return (
    <ul className='space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-4 xl:grid-cols-3 '>
      {products?.map((product) => {
        const productImg = getImgUrlMedia(product.thumbnailImg);
        return (
          <ProductItem
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

export default ProductList;
