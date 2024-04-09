"use client";

const ProductReviewQuantity = () => {
  return (
    <button
      onClick={() => {
        document
          .querySelector("#reviews")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className='text-primary font-bold'
    >
      560 đánh giá
    </button>
  );
};
export default ProductReviewQuantity;
