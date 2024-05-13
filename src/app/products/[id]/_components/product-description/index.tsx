import PageSubTitle from "@/components/ui/page-subTitle";
import React from "react";

const ProductDescription = ({description}:{description:string}) => {
  return (
    <div className="mt-12 md:mt-16">
      <PageSubTitle >Mô tả sản phẩm</PageSubTitle>
     <div className="md:grid md:grid-cols-[4fr_6fr] md:gap-x-6">
     <p className='mb-3'>
       {description}
      </p>
      <div className='border border-gray-800 w-full h-[300px]'></div>
     </div>
    </div>
  );
};

export default ProductDescription;
