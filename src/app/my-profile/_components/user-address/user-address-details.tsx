import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import ButtonAdjust from "../atoms/button-adjust";
import ButtonDelete from "../atoms/button-delete";

interface UserAddressDetailsProps extends IUser{
    id:string,
    address:string,
    isDefault?:boolean|null
}
const UserAddressDetails = ({isDefault,id,address,user}:UserAddressDetailsProps) => {
  const router = useRouter();

  // user
 
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

 
  const handleSetDefaultAddress = async (id: string) => {
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


  return (
     <li key={id}>
              {isDefault ? (
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
                      onClick={() => handleDeleteUserAddress(id!)}
                    />
                    <button
                      onClick={() => handleSetDefaultAddress(id!)}
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

  )
}

export default UserAddressDetails
