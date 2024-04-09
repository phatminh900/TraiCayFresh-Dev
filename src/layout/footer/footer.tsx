import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoTiktok
} from "react-icons/io5";
import PageSubTitle from "@/components/ui/page-subTitle";
import MaxWidthWrapper from "@/components/molecules/max-width-wrapper";

const Footer = () => {
  return (
    <footer className="py-8 border border-t-gray-200">
     <MaxWidthWrapper >
     <h2>Logo</h2>
      <p className='mt-6'>
        Cam kết cung cấp trái cây sạch chất lương hương vị tươi ngon đến người
        tiêu dùng
      </p>
      <div className='mt-6'>
        <PageSubTitle>Liên hệ</PageSubTitle>
        <div className='space-y-3'>
          <div className='flex gap-2 items-center'>
            <p>

            <IoLocationOutline size={25}  />
            </p>
            <p>42 đường số 8, Linh Tây ,Thủ Đức, HCM</p>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px]">
            <IoCallOutline  size={25} />
            </p>
            <p>0985215845</p>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px]">
            <IoMailOutline   size={25} />
            </p>
            <p>traicayfreshtmp315@gmail.com</p>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px] font-bold">
            Zalo
            </p>
            <p>0985215845</p>
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <PageSubTitle>Mạng xã hội</PageSubTitle>
        <div className="flex gap-4 items-center">
            <IoLogoFacebook  size={40}/>
            <IoLogoTiktok  size={40}/>
        </div>
      </div>
      <p className="mt-6 font-semibold text-lg">
        &copy; 2024 traicayfresh.com
      </p>
     </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
