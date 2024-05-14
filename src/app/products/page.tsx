import { getProducts } from "@/services/server/payload/products.service";
import ProductList from "../(home)/_components/product-list";

const Products = async () => {
  const { data: products } = await getProducts();
  return <ProductList products={products!} />;
};

export default Products;
