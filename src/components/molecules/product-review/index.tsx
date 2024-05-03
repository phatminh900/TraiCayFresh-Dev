"use client";
import {
  IoStar,
  IoStarOutline,
  IoCameraOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Textarea } from "@/components/ui/textarea";
import { getImgUrlMedia } from "@/utils/util.utls";
import { Product } from "@/payload/payload-types";
import { cn } from "@/lib/utils";
import { ALLOW_UPLOAD_IMG_LENGTH } from "@/constants/configs.constant";
interface ProductReviewProps {
  title: string;
  imgSrc: Product["thumbnailImg"];
  productId: string;
}
const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);

const ProductReview = ({ title, imgSrc, productId }: ProductReviewProps) => {
  const imgSource = getImgUrlMedia(imgSrc);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImgs, setSelectedImgs] = useState<string[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [review, setReview] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleSetRating = (rating: number) => setSelectedRating(rating);
  const handleOpenImgPicker = () => {
    if(selectedImgs.length===ALLOW_UPLOAD_IMG_LENGTH){
      alert('Đã upload số ảnh được quy định')
      return 
    }
    inputFileRef.current?.click();
  };
  
  const handlePickImgs = (e: ChangeEvent<HTMLInputElement>) => {
    
    const files = e.target.files;

    if (files) {
      if (files.length > 3) {
        alert(`Chỉ cho phép tối đa ${ALLOW_UPLOAD_IMG_LENGTH} ảnh. Quý khách vui lòng gửi lại`);
        return;
      }
      for (let i = 0; i < files.length; i++) {
        // get imgs url
        const fileReader = new FileReader();
        const file = files[i];
        fileReader.onload = () => {
          const imgUrl = fileReader.result;
          if (imgUrl && typeof imgUrl === "string") {
            console.log("go in here huh???");
            setSelectedImgs((prev) => [...prev, imgUrl]);
          }
        };
        fileReader.readAsDataURL(file);
      }
    }
  };
  const handleRemoveSelectedImg=(imgSrc:string)=>{
    setSelectedImgs(prev=>prev.filter(img=>img!==imgSrc))
  }
  const BtnClose = (
    <button>
      <IoCloseOutline className='hover:text-destructive' size={30} />
    </button>
  );
  const ReviewContent = (
    <div className='space-y-6'>
      <div className='flex justify-center relative'>
        <Image
          src={imgSource || ""}
          alt='Product img'
          height={isDesktop ? 100 : 60}
          width={isDesktop ? 100 : 60}
        />
       
      </div>
      <ul className='flex gap-2 justify-center'>
        {ratings.map((rating, index) => (
          <li className='cursor-pointer' key={index}>
            {index + 1 <= selectedRating ? (
              <IoStar
                onClick={() => handleSetRating(index + 1)}
                className='text-secondary'
                size={30}
              />
            ) : (
              <IoStarOutline
                onClick={() => handleSetRating(index + 1)}
                className='text-secondary'
                size={30}
              />
            )}
          </li>
        ))}
      </ul>
      <div>
        <Textarea
          data-cy='feedback-text-area'
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          className='placeholder:italic placeholder:text-muted-foreground'
          placeholder='Mời bạn đánh giá.'
        />
      </div>
      <div>
        <label htmlFor='product-review-img'></label>
        <Input
          onChange={handlePickImgs}
          ref={inputFileRef}
          type='file'
          accept='image/*'
          multiple
          id='product-review-img'
          className='hidden'
        />
        <button
          onClick={handleOpenImgPicker}
          className='flex text-primary items-center gap-2'
        >
          <IoCameraOutline /> Gửi ảnh đánh giá{" "}
          <span className='text-muted-foreground'>(tối đa 3 ảnh)</span>
        </button>
      </div>
      <div className='flex gap-2'>
        {selectedImgs.map((imgSrc) => (
          <div key={imgSrc} className='w-20 h-20 relative'>
            <Image
              src={imgSrc}
              fill
              className='object-fit object-cover'
              alt='review img'
            />
             <button onClick={()=>handleRemoveSelectedImg(imgSrc)} className={cn('absolute top-[5%]  right-[5%] flex-center rounded-full cursor-pointer bg-gray-300 hover:bg-gray-400',{
          'w-5 h-5':!isDesktop,
          'w-8 h-h-8':isDesktop
        })}>
          <IoCloseOutline  />
        </button>
          </div>
        ))}
      </div>
      <Button className="w-full">Gửi đánh giá</Button>
    </div>
  );

  if (isDesktop) {
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
          {ReviewContent}
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='secondary-outline'>Gửi đánh giá</Button>
      </DrawerTrigger>

      <DrawerContent style={{ height: !selectedImgs.length ? "75vh" : "90vh" }}>
        <DrawerHeader>
          <DrawerTitle className='text-center'>Đánh giá sản phẩm</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto w-[90%] pb-16 max-w-sm h-[50vh]'>
          {ReviewContent}

          <DrawerClose
            // onClick={handleClose}
            className='absolute top-[2%] right-[4%]'
            asChild
          >
            {BtnClose}
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductReview;
