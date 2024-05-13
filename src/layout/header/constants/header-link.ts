import { APP_URL } from "@/constants/navigation.constant";

export interface ILink {
    label: string;
    href: string;
  }
export const HEADER_LINKS: ILink[] = [
    {
      label: "Trang chủ",
      href: APP_URL.home,
    },
    {
      label: "Hot Combo",
      href: APP_URL.home + "#hot-combos",
    },
    {
      label: "Sản phẩm",
      href: APP_URL.home + "#products",
    },
    {
      label: "Về chúng tôi",
      href: APP_URL.home + "#about-us",
    },
  ];


  export const HEADER_LINKS_DESKTOP: ILink[] = [
  
    {
      label: "Hot Combo",
      href: APP_URL.home + "#hot-combos",
    },
    {
      label: "Sản phẩm",
      href: APP_URL.home + "#products",
    },
    {
      label: "Về chúng tôi",
      href: APP_URL.home + "#about-us",
    },
  ];