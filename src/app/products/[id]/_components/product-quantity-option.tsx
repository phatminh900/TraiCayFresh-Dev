"use client";
import { toast } from "sonner";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { EXCESS_QUANTITY_OPTION_MESSAGE,AMOUNT_PER_ADJUST_QUANTITY, MAXIMUN_KG_CAN_BUY_THROUGH_WEB } from "@/constants/constants.constant";
import { APP_PARAMS } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import { Product } from "@/payload/payload-types";
import { useRouter } from "next/navigation";



const QuantityOptions = ({
  options,
  currentOption,
}: {
  currentOption: number;
  options: Product["quantityOptions"];
}) => {
  const router = useRouter();

  const setQuantity = (quantity: number) => {
    router.push(`?${APP_PARAMS.currentQuantityOption}=${quantity}`);
  };
  const handleIncreaseAmount = () => {
    if (currentOption === MAXIMUN_KG_CAN_BUY_THROUGH_WEB) return toast.warning(EXCESS_QUANTITY_OPTION_MESSAGE);
    const quantity = currentOption + AMOUNT_PER_ADJUST_QUANTITY;
    setQuantity(quantity);
  };
  const handleDecreaseAmount = () => {
    if (currentOption === 0.5) return;
    const quantity = currentOption - AMOUNT_PER_ADJUST_QUANTITY;
    setQuantity(quantity);
  };
  return (
    <div className='mt-8'>
      <ul  data-cy='product-quantity-options' className='grid grid-cols-3 gap-3'>
        {options?.map((option) => (
          <li data-cy='product-quantity-option' key={option.id}>
            <button
              onClick={() => setQuantity(option.kg)}
              className={cn(
                "border border-gray-700 py-1.5 px-4 rounded-lg flex items-center justify-center w-full font-bold hover:border-primary",
                {
                  "border-primary text-primary": currentOption === option.kg,
                }
              )}
            >
              {option.kg} KG
            </button>
          </li>
        ))}
      </ul>
      <div className='mt-4 flex flex-col gap-2'>
        <p className='font-semibold'>Số lượng :</p>
        <div className='border border-gray-700 h-[50px] flex'>
          <button
          data-cy='decrease-quantity-option-product'
            onClick={handleDecreaseAmount}
            className='bg-gray-200 hover:bg-gray-300 px-4'
          >
            <IoRemoveOutline className='w-7 h-7' />
          </button>
          <p  data-cy='current-quantity-option' className='flex-1 flex justify-center items-center text-2xl'>
            {currentOption} KG
          </p>
          <button
          data-cy='increase-quantity-option-product'
            onClick={handleIncreaseAmount}
            className='bg-gray-200 hover:bg-gray-300 px-4'
          >
            <IoAddOutline className='w-7 h-7' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityOptions;
