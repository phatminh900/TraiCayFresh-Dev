import { Button, buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getProducts } from "@/services/server/payload.service";
import Link from "next/link";
import ProductList from "./_components/product-list";

export default async function Home() {
  const { products } = await getProducts();
  return (
    <section>
      {/* hero */}
      <div className='flex flex-col h-[calc(100vh-80px-16px)] py-6'>
        <div className='flex flex-col'>
          <h1 className='text-3xl text-center tracking-tighter mb-8'>
            <span className='text-primary font-bold'>Trái cây sạch</span> cho
            một sức khỏe tốt cho một cuộc sống tốt
          </h1>
          <p className='text-center mb-12'>
            <span className='font-semibold'>Trái cây Fresh</span> đảm bảo cung
            cấp hàng đảm bảo chất lượng , hương vị tươi ngon, và luôn sẵn sàng
            giao đến bạn
          </p>
          <Button className='w-4/5 self-center'>Chọn sản phẩm ngay</Button>
        </div>
        <div className='relative mt-6 '>
          {/* 1img contains 3 img */}
          {/* 3 imgs */}
          <div className='absolute z-0 w-[75%] h-[150px] border'></div>
          <div className='absolute z-20 w-[75%] h-[150px] border'></div>
          <div className='absolute z-10 w-[75%] h-[150px] border'></div>
        </div>
      </div>

      {/* products */}
      <PageTitle className='text-center text-3xl mb-8'>
        Tất cả sản phẩm
      </PageTitle>
      <ProductList products={products} />
      <div className='flex justify-center mt-4'>
        <Link
          href={APP_URL.products}
          className={buttonVariants({
            variant: "link",
            size: "lg",
            className: "!text-lg !text-center",
          })}
        >
          Xem tất cả sản phẩm &rarr;
        </Link>
      </div>
      <PageTitle className='text-center text-3xl mb-4 mt-12'>
        Về chúng tôi
      </PageTitle>
      <p className='font-bold text-center'>
        Với sứ mệnh đem trái cây sạch , giá cả phải chăng đến cho mọi mà người
        tiêu dụng không cần phải lo về chất lượng.
      </p>
    </section>
  );
}
