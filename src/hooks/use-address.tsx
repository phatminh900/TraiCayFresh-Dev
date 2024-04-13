"use client";
import {
  AddressValidationSchema,
  IAddressValidation,
} from "@/validations/user-infor.valiator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

const useAddress = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<IAddressValidation>({
    resolver: zodResolver(AddressValidationSchema),
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

  const districtValue = watch("district");
  const wardValue = watch("ward");
  const streetValue = watch("street");
  useEffect(() => {
    // reset if the value is set
    if (Object.keys(errors).length) {
      if (districtValue) {
        setError("district", { message: "" });
      }
      if (wardValue) {
        setError("ward", { message: "" });
      }
      if (streetValue) {
        setError("street", { message: "" });
      }
    }
  }, [districtValue, streetValue, wardValue, setError, errors]);
  return { setWardValue, setDistrictValue, register, handleSubmit, errors };
};

export default useAddress;
