import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import AddAdjustPhoneNumber from "../add-adjust-phone-number";
import ButtonDelete from "../atoms/button-delete";

interface UserPhoneNumberDetails {
  expandedIndex: number;
  isDefault?: boolean;
  phoneNumber: string;
  index: number;
  id: string;
  onExpand: (index: number) => void;
}

const UserPhoneNumberDetails = ({
  onExpand,
  id,
  index,
  phoneNumber,
  isDefault,
  expandedIndex,
}: UserPhoneNumberDetails) => {
  const router = useRouter();
  const {
    isPending: isUpdatingDefaultPhoneNumber,
    mutate: setDefaultPhoneNumber,
  } = trpc.user.setDefaultPhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });
  const { isPending: isDeletingPhoneNumber, mutate: deletePhoneNumber } =
    trpc.user.deletePhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  return (
    <li
      key={phoneNumber}
      className={cn(
        "w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis",
        {
          block: index === expandedIndex,
        }
      )}
    >
      <div className='inline-block min-w-[150px] max-w-[250px]'>
        <div className='font-normal'>
          {/* replace 84 to 0 */}
          <p className='font-bold flex flex-col'>
            {phoneNumber}{" "}
            {isDefault && <span className='text-xs'>(Mặc định)</span>}
          </p>
          {!isDefault && (
            <button
              onClick={() =>
                setDefaultPhoneNumber({
                  phoneNumber: phoneNumber,
                  id: id!,
                })
              }
              disabled={isUpdatingDefaultPhoneNumber}
              className={cn("text-xs text-primary", {
                "text-primary/80": isUpdatingDefaultPhoneNumber,
              })}
            >
              Đặt làm mặc định
            </button>
          )}
        </div>
      </div>
      <AddAdjustPhoneNumber
        index={index}
        id={id}
        onExpand={onExpand}
        isExpanded={index === expandedIndex}
        type='adjust'
        phoneAdjust={phoneNumber}
      />

      {!isDefault && expandedIndex !== index && (
        <>
          {/* TODO: atoms */}
          <ButtonDelete
            onClick={() =>
              deletePhoneNumber({
                id: id!,
              })
            }
            className='ml-4'
            disabled={isDeletingPhoneNumber}
          />
        </>
      )}
    </li>
  );
};

export default UserPhoneNumberDetails;
