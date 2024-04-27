import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FeedbackBox = () => {
  const [isOpenFeedbackBox, setIsOpenFeedbackBox] = useState(false);
  const toggleOpenFeedbackBox = () => setIsOpenFeedbackBox((prev) => !prev);
  const [feedbackText, setFeedbackText] = useState("");

  return (
    <div className='my-6'>
    <p data-cy='feedback-request-title' className='font-bold'>
      Nếu bạn không hài lòng hoặc có góp ý, xin vui lòng góp ý để chúng
      tôi cải thiện tốt hơn xin cảm ơn.{" "}
    </p>
    <button
    data-cy='open-feedback-box-btn'
      className='mt-2 text-primary'
      onClick={toggleOpenFeedbackBox}
    >
      Góp ý cho chúng tôi
    </button>
    {isOpenFeedbackBox && (
      <div data-cy='feedback-box-details'  className='mt-4'>
        <p data-cy='title-feedback-box' className='font-bold mb-2'>Góp ý</p>
        <div className='rounded-sm border space-y-2 border-gray-800 py-2 px-3'>
          <div data-cy='pre-filled-feedback-option' className='flex items-center gap-2'>
            <Checkbox id='delivery-faster' />
            <Label htmlFor='delivery-faster'>
              Cần giao hàng nhanh hơn
            </Label>
          </div>
          <div data-cy='pre-filled-feedback-option' className='flex items-center gap-2'>
            <Checkbox id='need-good-service-quality' />
            <Label htmlFor='need-good-service-quality'>
              Cần thái độ phục vụ tốt hơn
            </Label>
          </div>
        </div>
        <p className='text-sm text-muted-foreground mt-2 mb-4'>
          Hoặc quý khác hàng có những góp y khác vui lòng góp ý ở dưới
          đây
        </p>
        <form>
          <Textarea
          data-cy='feedback-text-area'
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={5}
            className='placeholder:italic placeholder:text-muted-foreground'
            placeholder='Mọi sự góp ý đều được chúng tôi ghi nhận và sẵn sàng sửa đổi và cải thiện để được tốt hơn.'
          />
          <Button data-cy='submit-feedback-btn' variant='secondary' className='mt-4 block w-full'>
            Góp ý
          </Button>
        </form>
      </div>
    )}
  </div>
  )
}

export default FeedbackBox