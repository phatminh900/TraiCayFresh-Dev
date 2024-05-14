import { Button } from '@/components/ui/button'
import React from 'react'
import BenefitsSection from './benefits-section'

const HeroSection = () => {
  return (
    <div className='flex flex-col min-h-[calc(100vh-80px-16px)] w-full mx-auto pb-8 md:py-16'>
    <div className="grid md:grid-cols-[4fr_6fr] gap-x-8 md:py-14">
    <div className='flex flex-col'>
       <h1 className='text-3xl text-center tracking-tighter mb-8 md:text-start md:text-4xl md:'>
         <span className='text-primary font-bold'>Trái cây sạch</span> cho
         một sức khỏe tốt cho một cuộc sống tốt
       </h1>
       <p className='text-center mb-12 md:text-lg md:text-start'>
         <span className='font-semibold'>Trái cây Fresh</span> đảm bảo cung
         cấp hàng đảm bảo chất lượng , hương vị tươi ngon, và luôn sẵn sàng
         giao đến bạn
       </p>
       <Button  className='w-4/5 self-center md:hidden'>Chọn sản phẩm ngay</Button>
       <Button variant='link'  className='self-start p-0 hidden md:block'>Chọn sản phẩm ngay &darr;</Button>


     </div>
     <div className='relative mt-6 h-[200px]'>
       {/* 1img contains 3 img */}
       {/* 3 imgs */}
       <div className='absolute z-0 w-[75%] h-[150px] border'></div>
       <div className='absolute z-20 w-[75%] h-[150px] border'></div>
       <div className='absolute z-10 w-[75%] h-[150px] border'></div>
     </div>

     <div className="block mt-6 md:hidden">
    <BenefitsSection />

     </div>
    </div>
    <div className="hidden md:block">
    <BenefitsSection />
    </div>
   </div>
  )
}

export default HeroSection