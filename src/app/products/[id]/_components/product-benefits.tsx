import { IoCardOutline, IoPricetagOutline, IoSync } from "react-icons/io5";

const ProductBenefits = () => {
  return (
    <div className='space-y-4 w-full'>
    <div className='flex gap-2 items-center'>
      <div className='flex-center h-10 w-10 rounded-full bg-slate-200'>
        <IoSync className='w-6 h-6 text-primary' />
      </div>
      <p className='text-xs'>
        Đổi sản phẩm mới nếu trái cây bị lỗi (sượng , hư , ...)
      </p>
    </div>
    <div className='flex gap-2 items-center'>
      <div className='flex-center h-10 w-10 rounded-full bg-slate-200'>
        <IoPricetagOutline className='w-6 h-6 text-primary' />
      </div>
      <p className='text-xs'>
        Giá cả hợp lí thay đổi theo nhu cầu của thị trường
      </p>
    </div>
    <div className='flex gap-2 items-center'>
      <div className='flex-shrink-0 flex-center h-10 w-10 rounded-full bg-slate-200'>
        <IoCardOutline className='w-6 h-6 text-primary' />
      </div>
      <p className='text-xs'>
        Miễn phí ship với đơn hàng từ 300K trở lên đối với thanh toán momo
        hoặc chuyển khoản và từ 600K trở lên đối với thanh toán bằng tiền
        mặt
      </p>
    </div>
  </div>
  )
}

export default ProductBenefits