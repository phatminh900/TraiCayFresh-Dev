"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SeparatorOption from "@/components/ui/separator-option";
import { APP_PARAMS } from "@/constants/navigation.constant";
import Auth from "../_component/auth";
import LoginByPhoneNumberAlternative from "./_components/login-by-phone-number-alternative";
import LoginByEmail from "./_components/login-by-email";



const LoginPage = () => {
  const router=useRouter()
  const searchParams = useSearchParams();
  const origin = searchParams.get(APP_PARAMS.origin) || "";
  const [isOpenLoginByPhoneNumber,setIsOpenByPhoneNumber]=useState(false)
  const handleOpenLoginByPhoneNumber=()=>{
      setIsOpenByPhoneNumber(true)
  
    }
  const handleCloseLoginByPhoneNumber=()=>{
    
    setIsOpenByPhoneNumber(false)
    router.push(!origin?`?${APP_PARAMS.isOpenOtp}=false`:`?${APP_PARAMS.origin}=${origin}&${APP_PARAMS.isOpenOtp}=false`)
  }


  return (
    <Auth type='login'>
    <LoginByEmail />
      <div className="flex flex-col items-center justify-center">
      <SeparatorOption className="mt-12 w-4/5" />
      <LoginByPhoneNumberAlternative origin={origin} isOpen={isOpenLoginByPhoneNumber} handleClose={handleCloseLoginByPhoneNumber} handleOpen={handleOpenLoginByPhoneNumber} />
      </div>
    </Auth>
  );
};

export default LoginPage;
