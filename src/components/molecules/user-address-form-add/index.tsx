import DeliveryAddress from "@/components/molecules/delivery-address";
import { Button } from "@/components/ui/button";
import useAddress from "@/hooks/use-address";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { isEmailUser } from "@/utils/util.utls";
import { useRouter } from "next/navigation";

interface UserAddressFormAddProps extends IUser {
  onExpand: (state: boolean) => void;
}

const UserAddressFormAdd = ({ onExpand, user }: UserAddressFormAddProps) => {
  const defaultUserName = user?.name || "";
  const defaultPhoneNumber = !isEmailUser(user!)
    ? user!.phoneNumber!
    : user!.phoneNumbers?.find((number) => number.isDefault)?.phoneNumber || "";
  const {
    errors,
    handleSubmit,
    register,
    setDistrictValue,
    setNameValue,
    setPhoneNumberValue,
    setWardValue,
  } = useAddress({
    district: "",
    name: defaultUserName,
    phoneNumber: defaultPhoneNumber,
    street: "",
    ward: "",
  });

  const router = useRouter();
  // user
  const {
    mutateAsync: addNewAddressUserEmail,
    isPending: isAddingNewAddressUserEmail,
    isSuccess: isSuccessUserEmail,
  } = trpc.user.addNewAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });

  // end user -----
  // customer phonenumber
  const {
    mutateAsync: addNewAddressPhoneNumber,
    isPending: isAddingNewAddressPhoneNumber,
    isSuccess: isSuccessUserPhoneNumber,
  } = trpc.customerPhoneNumber.addNewAddress.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
      return;
    },
    onSuccess: (data) => {
      handleTrpcSuccess(router, data?.message);
    },
  });
  const handleAddNewAddress = handleSubmit(async (data) => {
    // if email in user ==> login by email
    if (user && isEmailUser(user)) {
      await addNewAddressUserEmail({ ...data }).catch((err) =>
        handleTrpcErrors(err)
      );
      onExpand(false);
      return;
    }
    await addNewAddressPhoneNumber({ ...data }).catch((err) =>
      handleTrpcErrors(err)
    );
    onExpand(false);
  });
  return (
    <form
      data-cy='user-address-form-my-profile'
      className='mt-2'
      onSubmit={handleAddNewAddress}
    >
      <DeliveryAddress
        phoneNumberList={isEmailUser(user!) ? user?.phoneNumbers : undefined}
        errors={errors}
        onSetName={setNameValue}
        defaultUserName={defaultUserName}
        defaultUserPhoneNumber={defaultPhoneNumber}
        onSetPhoneNumber={setPhoneNumberValue}
        onSetDistrict={setDistrictValue}
        onSetWard={setWardValue}
        register={register}
      />
      <div className='mt-4 flex items-center w-full gap-4'>
       
        <Button
          data-cy='user-address-cancel-btn-my-profile'
          onClick={() => {
            onExpand(false);
          }}
          type='button'
          className='flex-1'
          variant='destructive'
        >
          Hủy
        </Button>
        <Button
          data-cy='user-address-add-btn-my-profile'
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
      </div>
    </form>
  );
};

export default UserAddressFormAdd;
