"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
// import { useMediaQuery } from "@/hooks/use-media-query"

import ErrorMsg from "@/components/atoms/error-msg";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { validateNumericInput } from "@/utils/util.utls";
import {
  IPhoneNumberValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";

import VerifyOtp from "./verify-otp";
import SeparatorOption from "@/components/ui/separator-option";

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
  const router=useRouter()
  const [isShowOtp, setIsShowOtp] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const handleToggleShowOtp=()=>setIsShowOtp(prev=>!prev)
  const { isPending:isSendOtp, mutate: loginByPhoneNumber } =
    trpc.customerPhoneNumber.requestOtp.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: () => {
        router.refresh()
        toast.success("Mã xác nhận đã được gửi đến số điện thoại của bạn và có hiệu lực trong 1 phút");
        setIsShowOtp(true);
      },
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPhoneNumberValidation>({});
  const handleSendPhoneVerification = handleSubmit(({ phoneNumber }) => {
    const validPhoneNumber = phoneNumber.replace("0", "84");
    loginByPhoneNumber({ phoneNumber: validPhoneNumber });
  });
  const validateIsNumberEntered = (e: ChangeEvent<HTMLInputElement>) => {
    if (validateNumericInput(e.target.value)) setPhoneNumber(e.target.value);
    return;
  };
  //   const isDesktop = useMediaQuery("(min-width: 768px)")

  //   if (isDesktop) {
  //     return (
  //       <Dialog open={open} onOpenChange={setOpen}>
  //         <DialogTrigger asChild>
  //           <Button variant="outline">Edit Profile</Button>
  //         </DialogTrigger>
  //         <DialogContent className="sm:max-w-[425px]">
  //           <DialogHeader>
  //             <DialogTitle>Edit profile</DialogTitle>
  //             <DialogDescription>
  //               Make changes to your profile here. Click save when you're done.
  //             </DialogDescription>
  //           </DialogHeader>
  //           <ProfileForm />
  //         </DialogContent>
  //       </Dialog>
  //     )
  //   }

  return (
    <Drawer  open={isOpen}>
      <DrawerTrigger asChild onClick={handleOpen}>
        <Button variant='outline'>Thanh toán</Button>
      </DrawerTrigger>
      <DrawerContent style={{height:'60vh'}}>
        <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
          <DrawerHeader className='text-center'>
            <DrawerTitle className='text-lg font-semibold'>
              Bạn chưa đăng nhập
            </DrawerTitle>
            <DrawerDescription className='text-sm'>
              Vui lòng đăng nhập tại đây
            </DrawerDescription>
            <Link
              href={{
                pathname: APP_URL.login,
                query: { origin: APP_URL.checkout.slice(1) },
              }}
              className={buttonVariants({
                variant: "link",
                size: "lg",
                className: "mt text-lg",
              })}
            >
              Đăng nhập
            </Link>
          </DrawerHeader>
         <SeparatorOption />
          {!isShowOtp && (
            <form
              onSubmit={handleSendPhoneVerification}
              className='flex flex-col '
            >
              <p className='text-lg font-bold text-center mb-2'>
                Mua hàng bằng số điện thoại
              </p>
              <Input
                type='tel'
                value={phoneNumber}
                className={cn({
                  "focus-visible:ring-red-500 ring-1 ring-red-400 w-full":
                    errors.phoneNumber,
                })}
                pattern='^[0-9]*$'
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại",
                  onChange: (e) => {
                    validateIsNumberEntered(e);
                  },
                  validate: (val) => {
                    const replace0To84 = val.replace("0", "84");

                    return (
                      PhoneValidationSchema.safeParse({
                        phoneNumber: replace0To84,
                      }).success || "Vui lòng nhập đúng số điện thoại"
                    );
                  },
                })}
                placeholder='Nhập số điện thoại'
              />

              {errors.phoneNumber && (
                <ErrorMsg msg={errors.phoneNumber.message} />
              )}
              <Button disabled={isSendOtp} className='w-1/2 self-center mt-4 block'>{isSendOtp?'Đang gửi mã OTP ':<>Xác nhận</>}</Button>
            </form>
          )}
          {isShowOtp && <VerifyOtp onToggleShowOtp={handleToggleShowOtp} phoneNumber={phoneNumber} />}

          <DrawerClose
            onClick={handleClose}
            className='absolute top-[5%] right-[8%]'
            asChild
          >
            <button>
              <IoCloseOutline className='hover:text-destructive' size={30} />
            </button>
          </DrawerClose>
          {/* <ProfileForm className='px-4' /> */}
          {/* <DrawerFooter className="pt-2">
           */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CartRequestLogin;
