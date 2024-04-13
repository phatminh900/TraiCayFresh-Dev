"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PageSubTitle from "@/components/ui/page-subTitle";
import { APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { validateNumericInput } from "@/utils/util.utls";


const TIME_TO_SEND_OTP_AGAIN = 90;

interface VerifyOtpProps {
  phoneNumber: string;
  onToggleShowOtp:()=>void
  routeToPushAfterVerifying:keyof (typeof APP_URL)
}
function VerifyOtp({ phoneNumber,onToggleShowOtp,routeToPushAfterVerifying }: VerifyOtpProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [disabled, setDisabled] = useState(false);
  const validPhoneNumber = phoneNumber.replace("0", "84");
  const [isSendingOptSuccess,setIsSendingOptSuccess]=useState(false)
  const handleChangeOtpInput = (input: string) => {
    if (validateNumericInput(input)) setOtp(input);
  };
  const {
    mutate: verifyOtp,
    isPending,
    isSuccess: isVerified,
  } = trpc.customerPhoneNumber.verifyOtp.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: () => {
      router.push(routeToPushAfterVerifying)

      toast.success("Xác thực thành công");
      router.refresh();
    },
  });
  const { mutateAsync: sendOtpAgain, isPending: isSendingOtp } =
    trpc.customerPhoneNumber.requestOtp.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: () => {
        toast.success("OTP đã được gửi lại vào số điện thoại của bạn");
        setDisabled(false);
      },
    });
  const [waitingTime, setWaitingTime] = useState(TIME_TO_SEND_OTP_AGAIN);
  const [requestCount, setRequestCount] = useState(0);

  const handleVerifyOTP = (e: FormEvent) => {
    e.preventDefault();
    if (!otp || !validateNumericInput(otp)) return;
    verifyOtp({ otp, phoneNumber: validPhoneNumber });
  };

  const handleSendRequestAgain = async () => {
    setRequestCount((prevCount) => prevCount + 1);

    // Increase waiting time if user sends requests frequently
    await sendOtpAgain({ phoneNumber: validPhoneNumber });
    if (requestCount >= 5 && waitingTime < 60) {
        // if access 5 time increase 150 seconds
      setWaitingTime((prevTime) => prevTime + 150);
    }

    setWaitingTime((prevTime) => {
      if (prevTime <= 0) {
        setDisabled(false);
        return TIME_TO_SEND_OTP_AGAIN;
      } else {
        setDisabled(true);
        return prevTime;
      }
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (disabled) {
      interval = setInterval(() => {
        setWaitingTime((prevTime) => {
          if (prevTime <= 0) {
            setDisabled(false);
            clearInterval(interval);
            return TIME_TO_SEND_OTP_AGAIN;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [disabled]);
  useEffect(()=>{
    setTimeout(() => {
        setIsSendingOptSuccess(true)
    }, 3000);
  },[])
  return (
    <div className='my-4 text-center '>
      <PageSubTitle>Nhập mã xác nhận</PageSubTitle>
      <p className='mb-3 text-muted-foreground text-sm'>
        Mã xác nhận đã được gửi đến số điện thoại của bạn
      </p>
      <form className="flex flex-col justify-center items-center" onSubmit={handleVerifyOTP}>
        <OTPInput
          value={otp}
          shouldAutoFocus
          onChange={handleChangeOtpInput}
          numInputs={6}
          renderInput={(props) => (
            <input  {...props}  type="tel" className='!w-10 h-10 border ml-4' />
          )}
        />
        <div className='flex flex-col items-center mt-6'>
          <Button disabled={otp.length !== 6 || isPending||isVerified}>Xác nhận</Button>
          <div className='mt-4 flex gap-2'>
            {isSendingOptSuccess&&<>
              <p>Chưa nhận được mã</p>
            <button
              type='button'
              onClick={handleSendRequestAgain}
              disabled={disabled || isPending || isSendingOtp || isVerified}
              className={cn("text-sm text-primary font-semibold", {
                "text-primary-80 cursor-not-allowed": disabled,
              })}
            >
              Thử lại{" "}
              {disabled && (
                <span className='text-primary/80'>sau {waitingTime} giây</span>
              )}
            </button>
            </>}
         

        
          </div>
          
        </div>
        <button
          
              type='button'
              onClick={onToggleShowOtp}
              disabled={isVerified}
              className={cn("text-sm font-semibold text-foreground mt-2", {
                "text-primary-80 cursor-not-allowed": disabled,
              })}
            >
              Xử dụng số điện thoại khác        <span className='text-primary'>Đổi lại số điện thoại</span>
            </button>
      </form>
    
    </div>
  );
}

export default VerifyOtp;
