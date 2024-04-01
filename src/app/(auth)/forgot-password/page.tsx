import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";

import { APP_URL } from "@/constants/navigation.constant";
import ForgotPasswordForm from "./forgot-password-form";
// TODO: put in types
const ForgotPassword = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const origin =
    typeof searchParams?.origin === "string" && searchParams?.origin === "login"
      ? searchParams?.origin
      : "";
  return (
    <div>
      <BreadCrumbLinks
        deep={origin ? 2 : 1}
        links={
          origin
            ? [
                {
                  label: "Đăng nhập",
                  href: APP_URL.login,
                },
                {
                  label: "Lấy lại mật khẩu",
                  href: APP_URL.forgotPassword,
                },
              ]
            : [
                {
                  label: "Lấy lại mật khẩu",
                  href: APP_URL.forgotPassword,
                },
                {
                  label: "",
                  href: "#",
                },
              ]
        }
      />
      <h2 className='text-2xl font-bold mt-4 text-gray-800'>
        Lấy lại mật khẩu
      </h2>
     <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
