"use client";
import { IoStar, IoStarOutline, IoCameraOutline } from "react-icons/io5";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Textarea } from "@/components/ui/textarea";
import { getImgUrlMedia } from "@/utils/util.utls";
import { Product } from "@/payload/payload-types";
interface ProductReviewProps {
  title: string;
  imgSrc: Product["thumbnailImg"];
  productId: string;
}
const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);

const ProductReview = ({ title, imgSrc, productId }: ProductReviewProps) => {
  const imgSource = getImgUrlMedia(imgSrc);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImgs, setSelectedImgs] = useState<(string )[]>(
    []
  );
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [review, setReview] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleSetRating = (rating: number) => setSelectedRating(rating);
  const handleOpenImgPicker = () => {
    inputFileRef.current?.click();
  };
  const handlePickImgs = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        // get imgs url
        const fileReader = new FileReader();
        const file = files[i];
        fileReader.onload = () => {
          const imgUrl = fileReader.result;
          if (imgUrl && typeof imgUrl==='string') {
            console.log('go in here huh???')
            setSelectedImgs((prev) => [...prev, imgUrl]);
          }
        };
        fileReader.readAsDataURL(file);
      }
    }
  };
  console.log(selectedImgs)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary-outline'>Gửi đánh giá</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>Đánh giá sản phẩm</DialogTitle>
          {/* <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription> */}
        </DialogHeader>
        <div>
          <div className='flex items-center relative w-12 h-12'>
            <Image
              src={imgSource || ""}
              alt='Product img'
              height={!isDesktop ? 60 : 100}
              width={!isDesktop ? 60 : 100}
            />
          </div>
          <ul className='flex gap-2'>
            {ratings.map((rating, index) => (
              <li key={index}>
                {selectedRating === index + 1 ? (
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
            <label htmlFor='product-review-img'>Chon anh</label>
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
              <IoCameraOutline /> Gửi ảnh đánh giá
            </button>
          </div>
          <div className="flex gap-2">
            {selectedImgs.map(img=><div key={img} className="w-20 h-20 relative">
            <Image  src={img} fill className="object-fit object-cover" alt="review img"/>
            </div>)}
          </div>
        </div>
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
};

export default ProductReview;
