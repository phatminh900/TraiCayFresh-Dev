"use client";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_URL } from "@/constants/navigation.constant";

import LoginByPhoneNumber from "@/components/molecules/login-by-phone-number";
import SeparatorOption from "@/components/ui/separator-option";
import { APP_URL_KEY } from "@/types/common-types";

interface CartRequestLoginProps {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}
export function CartRequestLogin({
  isOpen,
  handleClose,
  handleOpen,
}: CartRequestLoginProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const LinkLogin = (
    <Link
      href={{
        pathname: APP_URL.login,
        query: { origin: APP_URL.checkout.slice(1) },
      }}
      className={buttonVariants({
        variant: "link",
        size: "lg",
        className: "w-1/2 text-lg",
      })}
    >
      Đăng nhập
    </Link>
  );
  const BtnClose = (
    <button>
      <IoCloseOutline className='hover:text-destructive' size={30} />
    </button>
  );
  if (isDesktop) {
    return (
      <Dialog open={isOpen}>
        <DialogTrigger asChild onClick={handleOpen}>
          <Button variant='outline'>Thanh toán</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-2xl'>
          <div className='relative'>
            <DialogHeader className='text-center'>
              <DialogTitle className='text-lg text-center font-semibold'>
                Bạn chưa đăng nhập
              </DialogTitle>
              <DialogDescription className='text-sm text-center sm:text-base'>
                Vui lòng đăng nhập tại đây
              </DialogDescription>
              <div className='flex justify-center my-4'>{LinkLogin}</div>
            </DialogHeader>
            <SeparatorOption className="mt-8" />
            <LoginByPhoneNumber
              title='Mua hàng bằng số điện thoại'
              routeToPushAfterVerifying={APP_URL.checkout as APP_URL_KEY}
            />
            <DialogClose asChild onClick={handleClose} className='absolute top-0 right-2'>
              {BtnClose}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen}>
      <DrawerTrigger asChild onClick={handleOpen}>
        <Button variant='outline'>Thanh toán</Button>
      </DrawerTrigger>
      <DrawerContent style={{ height: "60vh" }}>
        <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
          <DrawerHeader>
            <DrawerTitle className='text-lg text-center font-semibold'>
              Bạn chưa đăng nhập
            </DrawerTitle>
            <DrawerDescription className='text-sm text-center sm:text-base'>
              Vui lòng đăng nhập tại đây
            </DrawerDescription>
            {LinkLogin}
          </DrawerHeader>
          <SeparatorOption />
          <LoginByPhoneNumber
            title='Mua hàng bằng số điện thoại'
            routeToPushAfterVerifying={APP_URL.checkout as APP_URL_KEY}
          />

          <DrawerClose
            onClick={handleClose}
            className='absolute top-[5%] right-[8%]'
            asChild
          >
            {BtnClose}
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CartRequestLogin;
