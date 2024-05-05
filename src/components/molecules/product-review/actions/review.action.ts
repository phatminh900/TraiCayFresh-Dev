"use server";
import { GENERAL_ERROR_MESSAGE } from "@/constants/api-messages.constant";
import { getPayloadClient } from "@/payload/get-client-payload";
import { imagesSchema } from "@/validations/img.validation";
import z, { ZodError } from "zod";
const reviewSchema = z.object({
  reviewText: z.string().optional(),
  rating: z.number().min(1,"Vui lòng chọn số sao đánh giá").max(5,"Vui lòng chọn số sao đánh giá"),
  userId: z.string(),
  productId: z.string(),
});
export type IReviewSchema=z.infer<typeof reviewSchema> & {imgs?:string|undefined}
const createNewReview = async (
    currentState:any,
  formData: FormData
):Promise<{[key in keyof Partial<IReviewSchema>]:string[]|undefined}| undefined> => {
  try {
    const reviewData = {
      reviewText: formData.get("reviewText"),
      reviewImgs: formData.get("reviewImgs"),
      userId:formData.get('userId'),
      rating:formData.get('rating'),
      productId:formData.get('productId')
    };
   const validateReviewData= reviewSchema.safeParse({...reviewData,rating:reviewData.rating && +reviewData.rating});
    if(!validateReviewData.success){
        return (validateReviewData.error.flatten().fieldErrors)
        
    }
    const reviewImgs =
      reviewData.reviewImgs && JSON.parse(reviewData.reviewImgs as string);
    const parsedReviewImgs:File[] = [];
    if (reviewImgs && Array.isArray(reviewImgs) && reviewImgs.length) {
      const parsedImg = reviewImgs.map((img) => JSON.parse(img));
      parsedReviewImgs.push(...parsedImg);
    }
    if (parsedReviewImgs.length) {
     const validateImgs= imagesSchema.safeParse({ imgs: parsedReviewImgs });
     if(!validateImgs.success){
        return (validateImgs.error.flatten().fieldErrors)
        
    }
    }
    // review is valid
   if(parsedReviewImgs.length){
    const MediaFormData=new FormData()
    MediaFormData.append('alt',"product's review img")
    MediaFormData.append('file',parsedReviewImgs[0])
    const payload=await getPayloadClient()
    console.log(parsedReviewImgs[0])
    // @ts-ignore
await payload.create({collection:'media',data:MediaFormData})
   }
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
        
      const errorField = error.errors[0];
      const path=errorField.path[0]
      return {
        [path]:errorField.message[0]
      };
    }
    if(!(error instanceof ZodError)){
        throw new Error(GENERAL_ERROR_MESSAGE)
    }
  }
};
export default createNewReview;

