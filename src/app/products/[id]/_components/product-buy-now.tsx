"use client";
import { Button } from "@/components/ui/button";
import { Product } from "@/payload/payload-types";
interface ProductBuyNowProps {
  product: Product;
}
const ProductBuyNow = ({ product }: ProductBuyNowProps) => {
  return <Button className="mt-6 w-full">Mua ngay</Button>;
};

export default ProductBuyNow;
