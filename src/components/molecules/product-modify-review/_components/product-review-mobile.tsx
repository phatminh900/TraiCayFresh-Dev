import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PropsWithChildren, useState } from "react";
import { IoCloseOutline, IoCreateOutline } from "react-icons/io5";
import ProductModifyReview from "..";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import SubmitProductReviewBtn from "./submit-product-review-btn";

interface ProductReviewMobileProps
  extends PropsWithChildren,
    Pick<ProductModifyReview, "type"> {
  selectedImgLength: number;
  createReviewAction: (payload: FormData) => void;
  isOpen: boolean;
  onToggleModalState: () => void;
  onSetIsSubmittingTheForm:()=>void
    isSubmitting:boolean,
  selectedRating: number;
}
const ProductReviewMobile = ({
  selectedImgLength,
  children,
  type,
  isSubmitting,
  isOpen,
  onToggleModalState,
  onSetIsSubmittingTheForm,
  selectedRating,
  createReviewAction,
}: ProductReviewMobileProps) => {


  return (
    <Drawer open={isOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn({ "!p-0": type === "adjust" })}
          onClick={onToggleModalState}
          variant={type === "add" ? "secondary-outline" : "text-primary"}
        >
          {type === "add" ? (
            <>Gửi đánh giá</>
          ) : (
            <div
              className={cn({
                "flex gap-1.5": type === "adjust",
              })}
            >
              <IoCreateOutline />
              Sửa
            </div>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent style={{ height: !selectedImgLength ? "75vh" : "90vh" }}>
        <DrawerHeader>
          <DrawerTitle className='text-center'>Đánh giá sản phẩm</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto w-[90%] pb-16 max-w-sm h-[50vh]'>
          <form action={createReviewAction}>
            {children}
            <SubmitProductReviewBtn
              onSetIsSubmittingTheForm={onSetIsSubmittingTheForm}
              selectedRating={selectedRating}
            />
          </form>

          <DrawerClose>
            <button
              onClick={onToggleModalState}
              className={cn("absolute top-[2%] right-[4%] cursor-pointer", {
                "text-destructive": isSubmitting,
              })}
              disabled={isSubmitting}
            >
              <IoCloseOutline size={30}/>
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductReviewMobile;
