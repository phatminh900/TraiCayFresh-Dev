"use client";
import { setValidPhoneNumber, transformPhoneNumberFrom84To0 } from "@/utils/util.utls";
import {
  AddressValidationSchema,
  IAddressValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

const useAddress = (defaultValue?: IAddressValidation) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<IAddressValidation>({
    resolver: zodResolver(AddressValidationSchema),
    defaultValues: defaultValue,
  });

  const setDistrictValue = useCallback(
    (district: string) => {
      setValue("district", district);
    },
    [setValue]
  );
  const setWardValue = useCallback(
    (ward: string) => setValue("ward", ward),
    [setValue]
  );
  const setNameValue = useCallback(
    (name: string) => setValue("name", name),
    [setValue]
  );
  const setPhoneNumberValue = useCallback(
    (phoneNumber: string) => setValue("phoneNumber", '84386325681'),
    [setValue]
  );
  const nameValue = watch("name");
  const phoneNumberValue = setValidPhoneNumber(watch("phoneNumber"));
  console.log(phoneNumberValue)
  const districtValue = watch("district");
  const wardValue = watch("ward");
  const streetValue = watch("street");
  console.log(PhoneValidationSchema.safeParse('843').success)
  useEffect(() => {
    // reset if the value is set
    if (Object.keys(errors).length) {
      if (nameValue) {
        setError("name", { message: "" });
      }
      if (phoneNumberValue==='84386325681') {
        console.log('safe pass')
        setError("phoneNumber", { message: "" });
      }
      if (districtValue) {
        setError("district", { message: "" });
      }
      if (wardValue) {
        setError("ward", { message: "" });
      }
      if (
        AddressValidationSchema.pick({ street: true }).safeParse(streetValue)
          .success
      ) {
        setError("street", { message: "" });
      }
    }
  }, [districtValue, streetValue, wardValue, setError, errors,nameValue,phoneNumberValue]);
  return { setWardValue, setDistrictValue, register, handleSubmit, errors ,setNameValue,setPhoneNumberValue};
};

export default useAddress;
