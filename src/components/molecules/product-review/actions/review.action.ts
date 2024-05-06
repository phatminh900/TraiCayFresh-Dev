"use server";
import { getPayloadClient } from "@/payload/get-client-payload";
import { Media } from "@/payload/payload-types";
import { getUserServer } from "@/services/server/payload/users.service";
import { imageSchema } from "@/validations/img.validation";
import z, { ZodError } from "zod";
const reviewSchema = z.object({
  reviewText: z.string().optional(),
  rating: z
    .number()
    .min(1, "Vui lòng chọn số sao đánh giá")
    .max(5, "Vui lòng chọn số sao đánh giá"),
  userId: z.string(),
  productId: z.string(),
});
const MAX_ALLOW_UPLOADED_IMG_LENGTH = 3;
export type IReviewSchema = z.infer<typeof reviewSchema> & {
  img?: string | undefined;
  user?: string | undefined;
  success?:'success'|'fail'|undefined
};

const createNewReview = async (
  {
    user,
    product,
    rating,
    reviewImgsFormData,
    reviewText,
  }: {
    user: {
      relationTo: "customers" | "customer-phone-number";
      value: string;
    };
    product: string;
    rating: number;
    reviewText: string;
    reviewImgsFormData: FormData;
  },
  currentState: any,
  formData: FormData
): Promise<
  { [key in keyof Partial<IReviewSchema>]: (string[]) | undefined } | undefined
> => {
  try {
    const userServer = await getUserServer();
    if (!userServer) {
      return { user: ["Bạn cần đăng nhập để thực hiện hành động này"] };
    }
    const isValidReview = reviewSchema.safeParse({
      rating,
      userId: user.value,
      productId: product,
      reviewText,
    });
    if (!isValidReview.success) {
      const err = isValidReview.error.flatten().fieldErrors;
      return err;
    }
    const payload = await getPayloadClient();
    const reviewImgs: File[] = [];
    for (let i = 0; i < MAX_ALLOW_UPLOADED_IMG_LENGTH; i++) {
      const reviewImgFile = reviewImgsFormData.get(`img-${i + 1}`);
     
      if (reviewImgFile) {
        const isValidImg = imageSchema.safeParse({ img: reviewImgFile });
        if (!isValidImg.success) {
          const err = isValidImg.error.flatten().fieldErrors;
          return err;
        }
        reviewImgs.push(reviewImgFile as File);
      }
    }
    if (reviewImgs.length) {
      const mediaUrl: Media[] = [];
      for (let i = 0; i < reviewImgs.length; i++) {
        const file = reviewImgs[i];
        const fileArrayBuffer = await reviewImgs[i].arrayBuffer();
        const media = await payload.create({
          collection: "media",
          data: { alt: "product's review img" },
          file: {
            data: Buffer.from(fileArrayBuffer),
            mimetype: file.type,
            name: file.name,
            size: file.size,
          },
        });
        mediaUrl.push(media);
      }
      await payload.create({
        collection: "reviews",
        data: {
          product,
          user: {
            value: user.value,
            relationTo: user.relationTo,
          },
          rating,
          reviewText,
          // reviewImgs:[{}]
          // reviewImgs: mediaUrl,
        },
      });
    }
    if (!reviewImgs.length) {
      const t = await payload.create({
        collection: "reviews",
        data: {
          product,
          user: {
            value: user.value,
            relationTo: user.relationTo,
          },
          rating,
          reviewText,
          reviewImgs: [],
        },
      });
    }
    return {success:['true']}
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      const errorField = error.errors[0];
      const path = errorField.path[0];
      return {
        [path]: errorField.message[0],
      };
    }
    if (!(error instanceof ZodError)) {
      return {success:['fail']};
    }
  }
};

export default createNewReview;
