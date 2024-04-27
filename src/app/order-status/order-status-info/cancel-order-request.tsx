import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Order } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type ICancelReason = Order["cancelReason"];
const CANCEL_REQUEST_REASONS: {
  label: string;
  value: ICancelReason;
}[] = [
  {
    label: "Tôi muốn cập nhật địa chỉ / số điện thoại nhận hàng",
    value: "update-address-phone-number",
  },
  {
    label: "Tôi muốn thêm / thay đổi mã giảm giá",
    value: "add-change-coupon-code",
  },
  {
    label: "Tôi không muốn mua hàng nữa",
    value: "dont-want-to-buy",
  },
  {
    label: "Chất lượng phục vụ không tốt",
    value: "bad-service-quality",
  },
  {
    label: "Lý do khác",
    value: "another-reason",
  },
];
interface CancelOrderRequestProps {
  isOpen: boolean;
  orderId: string;
  onToggleOpenCancelRequest: () => void;
}
const CancelOrderRequest = ({
  isOpen,
  orderId,
  onToggleOpenCancelRequest,
}: CancelOrderRequestProps) => {
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelingOrder } =
    trpc.order.cancelOrder.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  const [cancelReason, setCancelReason] = useState<ICancelReason>(
    "update-address-phone-number"
  );
  // after feedback was submitted close the form if try to open just need to show thank message
  const handleSubmitCancelReason = () => {
    cancelOrder({ cancelReason: cancelReason!, orderId });
  };
  const isMutating=isCancelingOrder
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <button
        data-cy='cancel-request-open-btn'
          onClick={onToggleOpenCancelRequest}
          className='text-destructive font-bold'
        >
          Hủy
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Lý do hủy</DialogTitle>
          <DialogDescription className='font-bold '>
            Hãy cho chúng tôi biết lý do hủy đơn hàng của bạn
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4'>
          <RadioGroup
            data-cy='cancel-request-radio-list'
            className='mt-8 space-y-3'
            value={cancelReason!}
            // id={`${props.id}`}
          >
            {CANCEL_REQUEST_REASONS.map((reason) => (
              <div key={reason.value} className='flex items-center gap-2'>
                <RadioGroupItem
                  id={`reason-cancel-${reason.value}`}
                  onClick={() => setCancelReason(reason.value)}
                  value={reason.value!}
                />
                <Label
                  className='cursor-pointer'
                  htmlFor={`reason-cancel-${reason.value}`}
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

        
        </div>
        <DialogFooter>
          <div className='flex items-center gap-2'>
            <Button
              className='flex-1'
              disabled={isCancelingOrder}
              onClick={onToggleOpenCancelRequest}
              type='button'
              variant='destructive'
            >
              Hủy yêu cầu
            </Button>

            <Button 
            disabled={isCancelingOrder} onClick={handleSubmitCancelReason} className='flex-1' variant='destructive-contained'>
              Hủy đơn hàng
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderRequest;
