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