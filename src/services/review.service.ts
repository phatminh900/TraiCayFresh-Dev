import { API_ROUTES } from "@/constants/api-routes.constant";
import { callApi } from "@/utils/service.util";

export const createProductReview = async ({
  reviewText,
  rating,
  productId,
  reviewImgs,
  userId,
}: {
  reviewText: string;
  rating: number;
  productId: string;
  reviewImgs?: { img: File }[];
  userId: string;
}) => {
  try {
    console.log("???");
    console.log(userId);
    const formData = new FormData();
    formData.append("reviewText", reviewText);
    formData.append("rating", rating.toString());
    formData.append("product", productId);
    formData.append(
      "user",
      JSON.stringify({
        relationTo: "customers",
        value: "661e8570ac32dc2586f46d98",
      })
    );
    // if (reviewImgs) {
    //   reviewImgs.forEach((img, index) => {
    //     formData.append(`reviewImgs[${index}]`,img.img)
    //   });
    // }

    const bodyResquest = {
      reviewText,
      rating: +rating,
      product: productId,
      user:{relationTo: "customers", value:userId},
      reviewImgs:reviewImgs![0].img
    };
    console.log(bodyResquest);
    console.log("tet");
    const data = await fetch(API_ROUTES.createReview, {
      method: "POST",
      body: JSON.stringify(bodyResquest),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // if(!data.ok) throw
    const parsed = await data.json();
    console.log("----");
    console.log(parsed);
    return data;
  } catch (error) {
    console.log("----");
    // console.log(error)
    console.log(error);
  }
};
