import { redirect } from "next/navigation";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { getMeServer } from "@/services/auth.service";
import { cookies } from "next/headers";
import AddAdjustPhoneNumber from "./_components/add-adjust-phone-number";
import UserPhoneNumber from "./_components/user-phone-number";
import Logout from "./_components/logout-btn";

const MyProfilePage = async () => {
  const nextCookies = cookies();
  const data = await getMeServer(nextCookies);
  const user = data.result?.user;
  if (!data.ok || !user) {
    redirect(APP_URL.login);
  }

  return (
    <>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myProfile, label: "Thông tin tài khoản" }]}
      />
      <PageTitle>Quản lý tài khoản</PageTitle>
      {/* General information */}
      <div className='space-y-2 mb-4'>
        <h3 className='font-bold text-lg mb-2 mt-6'>Thông tin cá nhân</h3>
        <p className='font-bold min-w-[200px] max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis'>
          Email: <span className='font-normal'>{user?.email}</span>
        </p>
        <div className='flex items-center'>
          <div className='flex gap-4 font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
            Tên: <p className='font-normal min-w-[180px] block'>{user?.name}</p>
          </div>
          <button className='flex items-center gap-2'>
            <IoCreateOutline className='text-primary' />{" "}
            <span className='text-primary'>Sửa</span>{" "}
          </button>
        </div>
        <UserPhoneNumber phoneNumber={user.phoneNumber} />
      </div>
      {/* Address */}
      <div className='space-y-2'>
        <h3 className='font-bold text-lg mb-2 mt-6'>Địa chỉ nhận hàng</h3>
        <div className='flex flex-col gap-2'>
          {/* <p>
        42 Đường số 8 Linh Tây Thủ Đức (Mặc định)
          </p>
          <div className='flex items-center gap-3'>
          <button className='flex items-center gap'>
            <IoCreateOutline /> <span className='text-primary'>Sửa</span>{" "}
          </button>
          <button className='flex items-center gap'>
            <IoTrashOutline className='text-destructive'/> <span className='text-destructive'>Xóa</span>{" "}
          </button>
          </div> */}
          <button className='text-primary self-start mt-1'>
            Thêm địa chỉ mới
          </button>
        </div>
      </div>
      {/* actions */}
      <div className='space-y-8 mt-10 flex flex-col items-center'>
        <Link
          href={APP_URL.myOrders}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full",
          })}
        >
          Tất cả đơn hàng của bạn
        </Link>
        <Logout />
      </div>
    </>
  );
};

export default MyProfilePage;
