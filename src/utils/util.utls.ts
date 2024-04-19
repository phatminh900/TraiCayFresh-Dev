import type {
  Customer,
  CustomerPhoneNumber,
  Media,
} from "@/payload/payload-types";

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
export const isEmailUser = (
  user: Customer | CustomerPhoneNumber
): user is Customer => {
  if ("email" in user) return true;
  return false;
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
