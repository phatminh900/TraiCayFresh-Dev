import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IReviewSchema } from "../actions/review.action";
interface ProductReviewDesktopProps extends PropsWithChildren {
  createReviewAction:(payload:FormData)=>void
}
const ProductReviewDesktop = ({ children ,createReviewAction}: ProductReviewDesktopProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary-outline'>Gửi đánh giá</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>Đánh giá sản phẩm</DialogTitle>
          {/* <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription> */}
        </DialogHeader>
        <form action={createReviewAction}>

        {children}
        </form>
        {/* <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        <DialogClose
          className='absolute top-[2%] right-[4%] cursor-pointer'
          asChild
        >
          <IoCloseOutline />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ProductReviewDesktop;
