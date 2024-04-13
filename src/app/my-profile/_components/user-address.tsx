"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DeliveryAddress from "@/components/molecules/delivery-address/delivery-address";
import { Button } from "@/components/ui/button";
import useAddress from "@/hooks/use-address";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import PageSubTitle from "@/components/ui/page-subTitle";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import { handleTrpcSuccess } from "@/utils/success.util";
import ButtonDelete from "./atoms/button-delete";
import ButtonAdjust from "./atoms/button-adjust";

interface UserAddressProps extends IUser {}
const UserAddress = ({ user }: UserAddressProps) => {
  const { errors, handleSubmit, register, setDistrictValue, setWardValue } =
    useAddress();

  const router = useRouter();

  // user
  const {
    mutateAsync: addNewAddressUserEmail,
    isPending: isAddingNewAddressUserEmail,
    isSuccess: isSuccessUserEmail,
  } = trpc.user.addNewAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      router.refresh();
      toast.message(data?.message);
    },
  });
  const { mutateAsync: setDefaultAddress, isPending: isSettingDefaultAddress } =
    trpc.user.setDefaultAddress.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => {
        handleTrpcSuccess(router, data.message);
      },
    });
  const { mutateAsync: deleteUserAddress, isPending: isDeletingUserAddress } =
    trpc.user.deleteAddress.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => {
        handleTrpcSuccess(router, data.message);
      },
    });
  // end user -----
  // customer phonenumber
  const {
    mutateAsync: addNewAddressPhoneNumber,
    isPending: isAddingNewAddressPhoneNumber,
    isSuccess: isSuccessUserPhoneNumber,
  } = trpc.customerPhoneNumber.addNewAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data.message);
    },
  });
  const {
    mutateAsync: setDefaultAddressUserPhoneNumber,
    isPending: isSettingDefaultAddressUserPhoneNumber,
  } = trpc.customerPhoneNumber.setDefaultAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data.message);
    },
  });
  const {
    mutateAsync: deleteUserPhoneNumberAddress,
    isPending: isDeletingUserPhoneNumberAddress,
  } = trpc.customerPhoneNumber.deleteAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data.message);
    },
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddNewAddress = handleSubmit(
    async ({ district, street, ward }) => {
      // if email in user ==> login by email
      const address = { district, street, ward };

      if (user && "email" in user) {
        await addNewAddressUserEmail(address);
        setIsExpanded(false);
        return;
      }
      await addNewAddressPhoneNumber(address);
      setIsExpanded(false);
    }
  );
  const handleSetDefaultAddress = async (id: string) => {
    const successMessage = "Thay đổi địa chỉ mặc định thành công";
    if (user && "email" in user) {
      await setDefaultAddress({ id });
      return;
    }
    await setDefaultAddressUserPhoneNumber({ id });
  };

  const handleDeleteUserAddress = async (id: string) => {
    if (user && "email" in user) {
      await deleteUserAddress({ id });
      return;
    }
    await deleteUserPhoneNumberAddress({ id });
  };

  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);

  return (
    <div>
      <ul className='space-y-3'>
        {sortedAddress?.map((ad) => {
          const address = `${ad.street} , ${ad.ward} , ${ad.district}`;
          return (
            <li key={ad.id}>
              {ad.isDefault ? (
                <p>
                  {address}

                  <span className='text-sm ml-2 text-primary'>( Mặc định)</span>
                </p>
              ) : (
                <div>
                  <p>{address}</p>
                  <div className='flex gap-3 items-center mt-1'>
                    <ButtonAdjust disabled={false} onClick={() => {}} />
                    <ButtonDelete
                      className='text-sm'
                      disabled={
                        isDeletingUserAddress ||
                        isDeletingUserPhoneNumberAddress
                      }
                      onClick={() => handleDeleteUserAddress(ad.id!)}
                    />
                    <button
                      onClick={() => handleSetDefaultAddress(ad.id!)}
                      disabled={
                        isSettingDefaultAddressUserPhoneNumber ||
                        isSettingDefaultAddress
                      }
                      className='text-sm text-primary'
                    >
                      Đặt làm địa chỉ mặc định
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className='flex flex-col gap-2'>
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className='text-primary text-lg self-start mt-4'
          >
            Thêm địa chỉ mới
          </button>
        )}
        {isExpanded && (
          <>
            {Boolean(user?.address?.length) && (
              <PageSubTitle className='mt-4 mb-0'>
                {" "}
                Thêm địa chỉ mới
              </PageSubTitle>
            )}
            <form className='mt-2' onSubmit={handleAddNewAddress}>
              <DeliveryAddress
                errors={errors}
                onSetDistrict={setDistrictValue}
                onSetWard={setWardValue}
                register={register}
              />
              <div className='mt-4 flex items-center w-full gap-4'>
                <Button
                  disabled={
                    isAddingNewAddressUserEmail ||
                    isAddingNewAddressPhoneNumber ||
                    isSuccessUserEmail ||
                    isSuccessUserPhoneNumber
                  }
                  className='flex-1'
                >
                  {isAddingNewAddressUserEmail || isAddingNewAddressPhoneNumber
                    ? "Đang cập nhật địa chỉ"
                    : "Xác nhận"}
                </Button>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                  }}
                  type='button'
                  className='flex-1'
                  variant='destructive'
                >
                  Hủy
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAddress;
