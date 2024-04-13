"use client";
import { useMemo, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import AddAdjustPhoneNumber from "./add-adjust-phone-number";
import { trpc } from "@/trpc/trpc-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { GENERAL_ERROR_MESSAGE } from "@/constants/constants.constant";
import { handleTrpcErrors } from "@/utils/error.util";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import ButtonDelete from "./atoms/button-delete";

interface UserPhoneNumberProps {
  phoneNumber: CustomerPhoneNumber["phoneNumber"] | Customer["phoneNumber"];
}
const UserPhoneNumber = ({ phoneNumber }: UserPhoneNumberProps) => {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const handleExpand = (index: number) => {
    setExpandedIndex(index);
  };
  const {
    isPending: isUpdatingDefaultPhoneNumber,
    mutate: setDefaultPhoneNumber,
  } = trpc.user.setDefaultPhoneNumber.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      router.refresh();
      toast.success(data?.message);
    },
  });
  const { isPending: isDeletingPhoneNumber, mutate: deletePhoneNumber } =
    trpc.user.deletePhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        router.refresh();
        toast.success(data?.message);
      },
    });
  const sortedPhoneNumber = useMemo(() => {
    if (phoneNumber) {
      return sortIsDefaultFirst(phoneNumber);
    }
    return [];
  }, [phoneNumber]);
  return (
    <div>
      {(phoneNumber?.length || 0) > 0 ? (
        <>
          <div className='flex gap'>
            <p className='min-w-[50px]'>SĐT</p>
            {typeof phoneNumber === "string" && (
              <p className='font-bold'>{phoneNumber.replace("84", "0")}</p>
            )}
            {Array.isArray(sortedPhoneNumber) && (
              <ul
                data-cy='phone-number-list-my-profile'
                className='w-full space-y-2'
              >
                {sortedPhoneNumber?.map((number, i) => {
                  const phoneNumber = number.phoneNumber.replace("84", "0");
                  return (
                    <li
                      key={number.phoneNumber}
                      className={cn(
                        "w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis",
                        {
                          block: i === expandedIndex,
                        }
                      )}
                    >
                      <div className='inline-block min-w-[150px] max-w-[250px]'>
                        <div className='font-normal'>
                          {/* replace 84 to 0 */}
                          <p className='font-bold flex flex-col'>
                            {phoneNumber}{" "}
                            {number.isDefault && (
                              <span className='text-xs'>(Mặc định)</span>
                            )}
                          </p>
                          {!number.isDefault && (
                            <button
                              onClick={() =>
                                setDefaultPhoneNumber({
                                  phoneNumber: number.phoneNumber,
                                  id: number.id!,
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
                        index={i}
                        id={number.id}
                        onExpand={handleExpand}
                        isExpanded={i === expandedIndex}
                        type='adjust'
                        phoneAdjust={phoneNumber}
                      />

                      {!number.isDefault && expandedIndex !== i && (
                        <>
                          {/* TODO: atoms */}
                          <ButtonDelete
                            onClick={() =>
                              deletePhoneNumber({
                                phoneNumber: number.phoneNumber,
                                id: number.id!,
                              })
                            }
                            className='ml-4'
                            disabled={isDeletingPhoneNumber}
                          />
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {Array.isArray(phoneNumber) && (
            <AddAdjustPhoneNumber
              key={expandedIndex}
              index={phoneNumber?.length || 0}
              isExpanded={phoneNumber?.length === expandedIndex}
              onExpand={handleExpand}
              phoneCount={phoneNumber?.length || 0}
              type='add-new'
            />
          )}
        </>
      ) : Array.isArray(phoneNumber) ? (
        <div className='flex w-full flex-col gap-2 items-start mt-2'>
          <p>Bạn chưa thêm số điện thoại </p>
          <AddAdjustPhoneNumber
            index={0}
            isExpanded={0 === expandedIndex}
            onExpand={handleExpand}
            phoneCount={0}
            type='add-new'
          />
        </div>
      ) : null}
    </div>
  );
};

export default UserPhoneNumber;
