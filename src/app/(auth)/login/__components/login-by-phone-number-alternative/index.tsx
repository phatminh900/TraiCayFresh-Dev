"use client";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";

import LoginByPhoneNumber from "@/components/molecules/login-by-phone-number";
import { APP_URL_KEY } from "@/types/common-types";
import { useSearchParams } from "next/navigation";

interface LoginByPhoneNumberAlternativeProps {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  origin: string;
}
export function LoginByPhoneNumberAlternative({
  origin,
  isOpen,
  handleClose,
  handleOpen,
}: LoginByPhoneNumberAlternativeProps) {
  const searchParams=useSearchParams()
  const isOpenOtp=(searchParams.get(APP_PARAMS.isOpenOtp))
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen}>
        <DialogTrigger asChild onClick={handleOpen}>
          <Button variant='outline'>Đăng nhập bằng số điện thoại</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-2xl'>
          <LoginByPhoneNumber
            title='Đăng nhập bằng số điện thoại'
            routeToPushAfterVerifying={(origin || APP_URL.home) as APP_URL_KEY}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen}>
      <DrawerTrigger asChild onClick={handleOpen}>
        <Button variant='outline'>Đăng nhập bằng số điện thoại</Button>
      </DrawerTrigger>
      <DrawerContent style={{ height:(isOpenOtp==='false' || !isOpenOtp)?'20vh': "50vh" }}>
        <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
          <LoginByPhoneNumber
            title=' Đăng nhập bằng số điện thoại'
            routeToPushAfterVerifying={(origin || APP_URL.home) as APP_URL_KEY}
          />

          <DrawerClose
            onClick={handleClose}
            className='absolute top-[2%] right-[4%]'
            asChild
          >
            <button>
              <IoCloseOutline className='hover:text-destructive' size={30} />
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default LoginByPhoneNumberAlternative;
