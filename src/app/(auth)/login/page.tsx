"use client";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import {
  AuthCredentialSchema,
  IAuthCredential,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Auth from "../_component/auth";
import ErrorMsg from "../_component/error-msg";
import { useCart } from "@/store/cart.store";
import SeparatorOption from "@/components/ui/separator-option";



const LoginPage = () => {
  const searchParams = useSearchParams();
  const cartItems = useCart((store) => store.items);
  const origin = searchParams.get("origin") || "";
  const router = useRouter();
  const {
    register,
    watch,
    formState: { errors },
    setFocus,
    handleSubmit,
  } = useForm<IAuthCredential>({
    resolver: zodResolver(AuthCredentialSchema),
  });
  const { mutate: setUserCart } = trpc.user.setUserCart.useMutation();
  const { mutate, isPending } = trpc.auth.login.useMutation({
    onError(error) {
      handleTrpcErrors(error);
    },
    onSuccess(data) {
      toast.success(data?.message);
      // after login successfully updated the cart of user
      if (cartItems.length) {
        const cartItemUser = cartItems.map((item) => ({
          product: item.id ,
          quantity: item.quantity,
        })) 
        setUserCart(cartItemUser );
      }
      router.refresh();
      setTimeout(() => {
        if (origin) {
          return router.push(`/${origin}`);
        }
        router.push("/");
      }, 500);
    },
  });
  const login = handleSubmit(({ email, password }) => {
    mutate({ email, password });
  });
  // first focus to the name field
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <Auth type='login'>
      <form onSubmit={login} className='mt-8 grid gap-y-4'>
        <div>
          <Label htmlFor='email' className='block mb-2'>
            Email
          </Label>
          <Input
            data-cy='input-email-login'
            {...register("email")}
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.email,
            })}
            placeholder='email@gmail.com'
            id='email'
          />
          {errors.email && (
            <ErrorMsg field='email' msg={errors.email.message} />
          )}
        </div>
        <div>
          <Label htmlFor='password' className='block mb-2'>
            Mật khẩu
          </Label>
          <InputPassword
            data-cy='input-password-login'
            {...register("password")}
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.password,
            })}
            placeholder='Nhập mật khẩu'
            id='password'
          />

          {errors.password && (
            <ErrorMsg field='password' msg={errors.password.message} />
          )}
        </div>
        <Link
          data-cy='forgot-password-link'
          href={{
            pathname: APP_URL.forgotPassword,
            query: {
              origin: "login",
            },
          }}
          className={buttonVariants({ variant: "link" })}
        >
          Quên mật khẩu?
        </Link>
        <Button data-cy='btn-submit-login'>{isPending ? "Đang Đăng nhập" : "Đăng nhập"}</Button>

        <Link
          href={APP_URL.signUp}
          className={buttonVariants({ variant: "link" })}
        >
          Chưa có tài khoản. Đăng kí ngay &rarr;
        </Link>
      </form>
      <div className="flex justify-center">
      <SeparatorOption className="mt-12 w-4/5" />
            
      </div>
    </Auth>
  );
};

export default LoginPage;
