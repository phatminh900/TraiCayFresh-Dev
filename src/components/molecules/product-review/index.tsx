"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GENERAL_ERROR_MESSAGE } from "@/constants/api-messages.constant";
import { ALLOW_UPLOAD_IMG_LENGTH } from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Customer, CustomerPhoneNumber, Product, Review } from "@/payload/payload-types";
import { getImgUrlMedia, stringify } from "@/utils/util.utls";
import { imageSchema } from "@/validations/img.validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import {
  IoCameraOutline,
  IoCloseOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import ProductInspectReviewImg from "./_components/inspect-img";
import ProductReviewDesktop from "./_components/product-review-desktop";
import ProductReviewMobile from "./_components/product-review-mobile";
import createNewReview from "./actions/review.action";
import SubmitProductReviewBtn from "./_components/submit-product-review-btn";
import { useFormState } from "react-dom";
import ErrorMsg from "@/components/atoms/error-msg";
interface ProductReviewProps {
  title: string;
  imgSrc: Product["thumbnailImg"];
  productId: string;
  userId?: Customer['id']|CustomerPhoneNumber['id'];
}

const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);

const ProductReview = ({
  userId,
  title,
  imgSrc,
  productId,
}: ProductReviewProps) => {
  const imgSource = getImgUrlMedia(imgSrc);
  const [reviewResult, setReviewResult] = useState<null | Review>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImgs, setSelectedImgs] = useState<{ id: string; img: File }[]>(
    []
  );
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [review, setReview] = useState("");

  const router = useRouter();
  // const { createNewReview, isCreatingNewReview } = useCreateNewProductReview();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSetRating = (rating: number) => setSelectedRating(rating);
  const handleOpenImgPicker = () => {
    if (setSelectedImgs.length === ALLOW_UPLOAD_IMG_LENGTH) {
      alert("Đã upload số ảnh được quy định");
      return;
    }
    inputFileRef.current?.click();
  };

  const handlePickImgs = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      if (files.length > 3) {
        alert(
          `Chỉ cho phép tối đa ${ALLOW_UPLOAD_IMG_LENGTH} ảnh. Quý khách vui lòng gửi lại`
        );
        return;
      }
      for (let i = 0; i < files.length; i++) {
        // get imgs url
        try {
          const file = files[i];
          imageSchema.parse({ img: file });

          setSelectedImgs((prev) => [
            ...prev,
            { id: crypto.randomUUID(), img: file },
          ]);

          // const fileReader = new FileReader();
          // fileReader.onload = () => {
          //   const imgUrl = fileReader.result;
          //   if (imgUrl && typeof imgUrl === "string") {
          //     setSelectedImgSrcs((prev) => [...prev, {src:imgUrl,id:crypto.randomUUID()}]);
          //   }
          // };
          // fileReader.readAsDataURL(file);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errMsg = error.errors[0].message || GENERAL_ERROR_MESSAGE;
            toast.error(errMsg);
          } else {
            // Some other error occurred
            toast.error(GENERAL_ERROR_MESSAGE);
          }
        }
      }
    }
  };
  const handleRemoveSelectedImg = (id: string) => {
    setSelectedImgs((prev) => prev.filter((img) => img.id !== id));
  };
  const handleSubmitReview = () => {
    const reviewProductImgs = selectedImgs.map((img) => ({ img: img.img }));
  };
  const selectedImgFiles=selectedImgs.map(img=>stringify(img.img))
const createNewReviewAction=createNewReview.bind(null)
const [formState,formAction]=useFormState(createNewReviewAction,null)
console.log('---- form state')
console.log(formState)
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
      <div>

      <ul className='flex gap-2 justify-center'>
        {ratings.map((_, index) => (
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
      {formState?.rating && !selectedRating && <div className="flex justify-center mt-2">
        <ErrorMsg msg={formState.rating[0]}/>
        </div>}
      </div>

      <div>
        <Textarea
          data-cy='feedback-text-area'
          value={review}
          name='reviewText'
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
         <Input
         name="userId"
         className="hidden"
         onChange={()=>{}}
         value={userId}
        />
        <Input  name="productId" className="hidden" onChange={()=>{}} value={productId}/>
        <Input name="rating" className="hidden" onChange={()=>{}} value={selectedRating}/>
        <Input className="hidden" name='reviewImgs'    onChange={()=>{}}
          value={JSON.stringify(selectedImgFiles)}/>
        <button
          onClick={handleOpenImgPicker}
          className='flex text-primary items-center gap-2'
        >
          <IoCameraOutline /> Gửi ảnh đánh giá{" "}
          <span className='text-muted-foreground'>(tối đa 3 ảnh)</span>
        </button>
      </div>
      <div className='flex gap-2'>
        {selectedImgs.map((img, index) => (
          <div key={index} className='w-20 h-20 relative'>
            <ProductInspectReviewImg>
              <Image
                src={URL.createObjectURL(img.img)}
                fill
                className='object-fit object-cover'
                alt='review img'
              />
            </ProductInspectReviewImg>
            <button
              onClick={() => handleRemoveSelectedImg(img.id)}
              className={cn(
                "absolute top-[5%]  right-[5%] flex-center rounded-full cursor-pointer bg-gray-300 hover:bg-gray-400",
                {
                  "w-5 h-5": !isDesktop,
                  "w-6 h-6": isDesktop,
                }
              )}
            >
              <IoCloseOutline />
            </button>
          </div>
        ))}
      </div>
     <SubmitProductReviewBtn selectedRating={selectedRating} />
    </div>
  );
  if(isDesktop){
    return <ProductReviewDesktop createReviewAction={formAction}>{ReviewContent}</ProductReviewDesktop>;
  }

    return   <ProductReviewMobile createReviewAction={formAction} selectedImgLength={selectedImgs.length}>
        {ReviewContent}
      </ProductReviewMobile>
 
}
export default ProductReview;
