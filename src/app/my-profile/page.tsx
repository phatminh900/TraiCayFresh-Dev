import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/auth.service";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logout from "./_components/logout-btn";
import UserName from "./_components/user-name";
import UserPhoneNumber from "./_components/user-phone-number";

const MyProfilePage = async () => {
  const nextCookies = cookies();
 const user=await getUserServer(nextCookies)
  if ( !user) {
    redirect(APP_URL.login + `?origin=${APP_URL.myProfile.slice(1)}`);
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
        <p data-cy='email-my-profile' className='font-bold min-w-[200px] max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis'>
          Email: <span className='font-normal'>{user?.email}</span>
        </p>
        <UserName userName={user.name} />
        <UserPhoneNumber phoneNumber={user.phoneNumber} />
      </div>
      {/* Address */}
      <div className='space-y-2'>
        <h3 className='font-bold text-lg mb-2 mt-6'>Địa chỉ nhận hàng</h3>
        <div className='flex flex-col gap-2'>
        
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
