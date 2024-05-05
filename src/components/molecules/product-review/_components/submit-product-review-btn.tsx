import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

interface SubmitProductReviewBtnProps{
  selectedRating:number,

}
const SubmitProductReviewBtn = ({selectedRating}:SubmitProductReviewBtnProps) => {
    const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending||!selectedRating} className='w-full'>
    {pending ? "Đang gửi đánh giá..." : "Gửi đánh giá"}
  </Button>
  )
}

export default SubmitProductReviewBtn