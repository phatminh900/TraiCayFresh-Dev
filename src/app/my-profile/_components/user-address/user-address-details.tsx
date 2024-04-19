import DeliveryAddress from "@/components/molecules/delivery-address";
import { Button } from "@/components/ui/button";
import useAddress from "@/hooks/use-address";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import ButtonAdjust from "../atoms/button-adjust";
import ButtonDelete from "../atoms/button-delete";
import ButtonSetDefault from "../atoms/button-set-default";
import { isEmailUser } from "@/utils/util.utls";

interface UserAddressDetailsProps extends IUser {
  id: string;
  ward: string;
  street: string;
  currentIndex: number;
  index: number;
  district: string;
  onExpand: (index: number) => void;
  phoneNumber: string;
  name: string;
  isDefault?: boolean | null;
}
const UserAddressDetails = ({
  isDefault,
  onExpand,
  id,
  phoneNumber,
  name,
  currentIndex,
  index,
  user,
  ward,
  street,
  district,
}: UserAddressDetailsProps) => {
  const router = useRouter();
  const {
    errors,
    handleSubmit,
    register,
    setDistrictValue,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
  } = useAddress({ ward, district, street, phoneNumber, name });
  // find districtId for auto completion delivering address
  const address = `${street} , ${ward} , ${district}`;

  // user

  const { mutateAsync: setDefaultAddress, isPending: isSettingDefaultAddress } =
    trpc.user.setDefaultAddress.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  const { mutateAsync: deleteUserAddress, isPending: isDeletingUserAddress } =
    trpc.user.deleteAddress.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message);
      },
    });
  const { mutateAsync: adjustUserAddress, isPending: isAdjustingUserAddress } =
    trpc.user.adjustUserAddress.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => handleTrpcSuccess(router, data?.message),
    });
  // end user -----
  // customer phonenumber

  const {
    mutateAsync: setDefaultAddressUserPhoneNumber,
    isPending: isSettingDefaultAddressUserPhoneNumber,
  } = trpc.customerPhoneNumber.setDefaultAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });
  const {
    mutateAsync: adjustUserPhoneNumberAddress,
    isPending: isAdjustingUserAddressCustomerPhoneNumber,
  } = trpc.customerPhoneNumber.adjustUserAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => handleTrpcSuccess(router, data?.message),
  });
  const {
    mutateAsync: deleteUserPhoneNumberAddress,
    isPending: isDeletingUserPhoneNumberAddress,
  } = trpc.customerPhoneNumber.deleteAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });

  const handleSetDefaultAddress = async (id: string) => {
    if (user && isEmailUser(user)) {
      await setDefaultAddress({ id }).catch((err) => handleTrpcErrors(err));
      return;
    }
    await setDefaultAddressUserPhoneNumber({ id }).catch((err) =>
      handleTrpcErrors(err)
    );
  };

  const handleDeleteUserAddress = async (id: string) => {
    if (user && isEmailUser(user)) {
      await deleteUserAddress({ id }).catch((err) => handleTrpcErrors(err));
      return;
    }
    await deleteUserPhoneNumberAddress({ id }).catch((err) =>
      handleTrpcErrors(err)
    );
  };
  const handleAdjustAddress = handleSubmit(async (data) => {
    const validPhoneNumber=(data.phoneNumber)
    if (user && isEmailUser(user)) {

      await adjustUserAddress({ id, ...data ,phoneNumber:validPhoneNumber}).catch((err) =>
        handleTrpcErrors(err)
      );
      onExpand(-1);
      return;
    }
    await adjustUserPhoneNumberAddress({ id, ...data ,phoneNumber:validPhoneNumber}).catch((err) =>
      handleTrpcErrors(err)
    );
    onExpand(-1);
  });
  return (
    <li key={id} data-cy='user-address-detail-my-profile'>
      {isDefault ? (
        <div>
          <div data-cy='user-address-detail' className='flex flex-col gap-1 mb-2'>
            <p data-cy='user-address-detail-info' className='font-bold'>
              {name}
              <span> - </span>
              {(phoneNumber)}
            </p>
            <p data-cy='user-address-detail-address'>
              {address}
              <span className='text-sm ml-2 text-primary'>( Mặc định )</span>
            </p>
          </div>

          <ButtonAdjust
            disabled={
              isAdjustingUserAddressCustomerPhoneNumber ||
              isAdjustingUserAddress
            }
            onClick={() => {
              currentIndex === index ? onExpand(-1) : onExpand(index);
            }}
          />
        </div>
      ) : (
        <div>
          <div data-cy='user-address-detail' className='flex flex-col gap-1 mb-2'>
            <p data-cy='user-address-detail-info' className='font-bold'>
              {name}
              <span> - </span>
              {(phoneNumber)}
            </p>
            <p data-cy='user-address-detail-address'>
              {address}
            </p>
          </div>
          <div className='flex gap-3 items-center mt-1'>
            <ButtonAdjust
              disabled={
                isAdjustingUserAddressCustomerPhoneNumber ||
                isAdjustingUserAddress
              }
              onClick={() => {
                onExpand(index);
              }}
            />
            <ButtonDelete
              className='text-sm'
              disabled={
                isDeletingUserAddress || isDeletingUserPhoneNumberAddress
              }
              onClick={() => handleDeleteUserAddress(id!)}
            />
            <ButtonSetDefault
              onClick={() => handleSetDefaultAddress(id!)}
              disabled={
                isSettingDefaultAddressUserPhoneNumber ||
                isSettingDefaultAddress
              }
            />
          </div>
        </div>
      )}
      {currentIndex === index && (
        <>
          <p className='font-bold text-lg mt-6'>Sửa địa chỉ</p>
          <form
            data-cy='user-address-adjust-form-my-profile'
            className='mt-2'
            onSubmit={handleAdjustAddress}
          >
            <DeliveryAddress
              errors={errors}
              defaultUserName={name}
              phoneNumberList={('email' in user!)?user.phoneNumbers:undefined}
              onSetName={setNameValue}
              onSetPhoneNumber={setPhoneNumberValue}
              defaultUserPhoneNumber={(phoneNumber)}
              defaultDistrictValue={district}
              defaultWardValue={ward}
              onSetDistrict={setDistrictValue}
              onSetWard={setWardValue}
              register={register}
            />
            <div className='mt-4 flex items-center w-full gap-4'>
              <Button
                data-cy='user-address-add-btn-my-profile'
                disabled={isAdjustingUserAddress || isAdjustingUserAddress}
                className='flex-1'
              >
                {isAdjustingUserAddress || isAdjustingUserAddress
                  ? "Đang cập nhật địa chỉ"
                  : "Xác nhận"}
              </Button>
              <Button
                data-cy='user-address-cancel-btn-my-profile'
                onClick={() => {
                  onExpand(-1);
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
    </li>
  );
};

export default UserAddressDetails;
