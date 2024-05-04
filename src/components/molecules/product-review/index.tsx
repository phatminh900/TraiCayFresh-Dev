"use client";
import { zfd } from 'zod-form-data';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GENERAL_ERROR_MESSAGE } from "@/constants/api-messages.constant";
import { ALLOW_UPLOAD_IMG_LENGTH } from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Product, Review } from "@/payload/payload-types";
import { getImgUrlMedia } from "@/utils/util.utls";
import { imageSchema, imagesSchema } from "@/validations/img.validation";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  IoCameraOutline,
  IoCloseOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import ProductReviewDesktop from "./_components/product-review-desktop";
import ProductReviewMobile from "./_components/product-review-mobile";
import ProductInspectReviewImg from "./_components/inspect-img";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { useRouter } from "next/navigation";
import { handleTrpcSuccess } from "@/utils/success.util";
interface ProductReviewProps {
  title: string;
  imgSrc: Product["thumbnailImg"];
  productId: string;
}
const fileSchema=z.object({
  file:zfd.file()
})
const ratings = Array.from({ length: 5 }).map((_, i) => i + 1);

const ProductReview = ({ title, imgSrc, productId }: ProductReviewProps) => {
  const imgSource = getImgUrlMedia(imgSrc);
  const [reviewResult, setReviewResult] = useState<null | Review>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImgs, setSelectedImgs] = useState<{ id: string; img: File }[]>(
    []
  );
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [review, setReview] = useState("");

  const router = useRouter();
  const {
    mutate: createReview,
    isPending: isCreatingReview,
    isSuccess,
  } = trpc.review.createReview.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data.message);
      // setReviewResult(data.result)
    },
  });
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
    const formData = new FormData();
    // const reviewImg=selectedImgs.map(img=>({img:img.img}))
    selectedImgs.forEach(img=>{
      console.log(img.img instanceof File)
    formData.append('file', img.img);

    })

    const formData2=new FormData()
    fileSchema.parse({file:selectedImgs[0].img})
    // formData2.append('file',selectedImgs[0].img)
    // createReview({ rating:selectedRating, reviewText:review,productId, formData:formData2});
  };
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
      <Button onClick={handleSubmitReview} disabled={isCreatingReview} className='w-full'>{isCreatingReview?"Đang gửi đánh giá...":"Gửi đánh giá"}</Button>
    </div>
  );

  if (isDesktop) {
    return <ProductReviewDesktop>{ReviewContent}</ProductReviewDesktop>;
  }

  return (
    <ProductReviewMobile selectedImgLength={selectedImgs.length}>
      {ReviewContent}
    </ProductReviewMobile>
  );
};

export default ProductReview;
