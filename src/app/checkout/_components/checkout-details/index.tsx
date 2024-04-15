import PageSubTitle from "@/components/ui/page-subTitle"

const CheckoutDetails = () => {
  return (
    <div>
        <PageSubTitle >Chi tiết thanh toán</PageSubTitle>
        <div data-cy="payment-details-box space-y-2">
            <div data-cy="payment-detail" className="flex items-center justify-center">
                <p className="font-bold">Tổng tiền thanh toán</p>
                <p>390.000D</p>
            </div>
            <div data-cy="payment-detail" className="flex items-center justify-center">
                <p className="font-bold">Giảm giá</p>
                <p>39.000D</p>
            </div>
            <div data-cy="payment-detail" className="flex items-center justify-center">
                <p className="font-bold">Phí vận chuyển</p>
                <p>30.000D</p>
            </div>
            <div data-cy="payment-detail" className="flex items-center justify-center">
                <p className="font-bold text-lg">Thành tiền</p>
                <p>30.000D</p>
            </div>
        </div>
    </div>
  )
}

export default CheckoutDetails