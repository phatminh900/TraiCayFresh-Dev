import Link from "next/link";
import { BsCartXFill } from "react-icons/bs";
import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";

const EmptyCart = () => {
  return (
    <div data-cy='empty-cart-checkout' className='flex items-center flex-col mt-10 gap-6'>
      <BsCartXFill size={150} className='text-primary' />
      <div className='text-center space-y-2'>
        <p className='text-2xl font-bold'>Giỏ hàng hiện đang trống</p>
        <p className='text-gray-700'>Nhanh chóng lựa sản phẩm nào</p>
        <Link
          href={APP_URL.products}
          className={cn("w-full", buttonVariants({ variant: "outline" }))}
        >
          Tất cả sản phẩm{" "}
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
