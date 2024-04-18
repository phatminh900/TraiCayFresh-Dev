import { Media } from "@/payload/payload-types";

export function formatPriceToVND(price: number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price);
}

export const getImgUrlMedia = (img: string | Media) => {
  return typeof img === "string" ? img : img.url;
};

export const validateNumericInput = (value: string) => {
  // Regular expression to match only numeric characters
  const numericRegex = /^[0-9]*$/;
  return numericRegex.test(value);
};
export const sortIsDefaultFirst = <
  T extends { isDefault?: boolean | undefined | null }
>(
  value: T[] | string
) => {
  if (Array.isArray(value))
    return value?.slice().sort((a, b) => {
      const isADefault = a.isDefault ?? false; // If isDefault is undefined, consider it false
      const isBDefault = b.isDefault ?? false; // If isDefault is undefined, consider it false
      if (isADefault && !isBDefault) {
        return -1;
      } else if (!isADefault && isBDefault) {
        return 1;
      } else {
        return 0;
      }
    }) as T[];
};

export const setValidPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith("84")) {
    return phoneNumber;
  }
  if (phoneNumber[0] === "0") {
    return phoneNumber.replace("0", "84");
  }
  return phoneNumber;
};
export const transformPhoneNumberFrom84To0 = (phoneNumber: string) => {
  if (phoneNumber.startsWith("84")) {
    return phoneNumber.replace("84", "0");
  }
  return phoneNumber;
};
