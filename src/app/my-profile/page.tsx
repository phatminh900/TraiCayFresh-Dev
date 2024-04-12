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
import UserPhoneNumber from "./_components/user-phone-number";
import PageSubTitle from "@/components/ui/page-subTitle";
import AddNewAddress from "./_components/add-new-address";

const MyProfilePage = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  console.log(user)
  if (!user) {
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
        <PageSubTitle>
        Thông tin cá nhân
        </PageSubTitle>
        <p
          data-cy='email-my-profile'
          className='font-bold min-w-[200px] max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis'
        >
          {"email" in user && (
            <>
              Email: <span className='font-normal'>{user?.email}</span>
            </>
          )}
        </p>
        <UserName userName={user.name || ""} />
        <UserPhoneNumber phoneNumber={user.phoneNumber || []} />
      </div>
      {/* Address */}
      <div className='space-y-2'>
       <PageSubTitle>Địa chỉ nhận hàng</PageSubTitle>
       <AddNewAddress />
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
