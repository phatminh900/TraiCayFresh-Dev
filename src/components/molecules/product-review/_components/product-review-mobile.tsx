import { IoCloseOutline } from "react-icons/io5";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";
import { IReviewSchema } from "../actions/review.action";

interface ProductReviewMobileProps extends PropsWithChildren {
  selectedImgLength: number;
  createReviewAction:(payload:FormData)=>void

  isOpen:boolean,
  onToggleModalState:()=>void


}
const ProductReviewMobile = ({
  selectedImgLength,
  children,
  isOpen,onToggleModalState,
  createReviewAction
  

}: ProductReviewMobileProps) => {
  return (
    <Drawer open={isOpen}>
      <DrawerTrigger asChild>
        <Button onClick={onToggleModalState} variant='secondary-outline'>Gửi đánh giá</Button>
      </DrawerTrigger>

      <DrawerContent style={{ height: !selectedImgLength ? "75vh" : "90vh" }}>
        <DrawerHeader>
          <DrawerTitle className='text-center'>Đánh giá sản phẩm</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto w-[90%] pb-16 max-w-sm h-[50vh]'>
          <form action={createReviewAction}>{children}</form>

          <DrawerClose
            // onClick={handleClose}
            className='absolute top-[2%] right-[4%] cursor-pointer'
            asChild
          >
            <IoCloseOutline size={30} className='hover:text-destructive' />
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductReviewMobile;
