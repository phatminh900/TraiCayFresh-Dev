import PageSubTitle from "@/components/ui/page-subTitle";
import React from "react";

const ProductDescription = () => {
  return (
    <div className="mt-12 md:mt-16">
      <PageSubTitle >Mô tả sản phẩm</PageSubTitle>
     <div className="md:grid md:grid-cols-[4fr_6fr] md:gap-x-6">
     <p className='mb-3'>
        Măng cụt (nữ hoàng trái cây) là 1 loại trái cây với hương vị tươi ngon ,
        thanh mát , dịu nhẹ. Không những ngon măng cụt còn có những công dụng
        tuyệt vời.
      </p>
      <div className='border border-gray-800 w-full h-[300px]'></div>
     </div>
    </div>
  );
};

export default ProductDescription;
