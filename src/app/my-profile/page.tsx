import { cookies } from "next/headers";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { buttonVariants } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/auth.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logout from "./_components/logout-btn";
import UserName from "./_components/user-name";
import UserPhoneNumbers from "./_components/user-phone-numbers";
import PageSubTitle from "@/components/ui/page-subTitle";
import UserAddress from "./_components/user-address";
import UserEmail from "./_components/user-email";

const MyProfilePage = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  return (
    <>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myProfile, label: "Thông tin tài khoản" }]}
      />
      <PageTitle>Quản lý tài khoản</PageTitle>
      {/* General information */}
      <div className='space-y-2 mb-4'>
        <PageSubTitle>Thông tin cá nhân</PageSubTitle>
        <UserEmail user={user} />
        <UserName user={user} />
        <UserPhoneNumbers user={user} />
      </div>
      {/* Address */}
      <div className='space-y-2'>
        <PageSubTitle>Địa chỉ nhận hàng</PageSubTitle>
        <UserAddress user={user} />
      </div>
      {/* actions */}
      <div className='space-y-8 mt-12 flex flex-col items-center'>
        <Link
          href={APP_URL.myOrders}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full mt-6",
          })}
        >
          Tất cả đơn hàng của bạn
        </Link>
        <Logout user={user} />
      </div>
    </>
  );
};

export default MyProfilePage;
