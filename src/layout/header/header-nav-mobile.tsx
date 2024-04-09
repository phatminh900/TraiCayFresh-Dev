"use client";
import Link from "next/link";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { APP_URL } from "@/constants/navigation.constant";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export interface ILink {
  label: string;
  href: string;
}

const LINKS: ILink[] = [
  {
    label: "Trang chủ",
    href: APP_URL.home,
  },
  {
    label: "Combo hot",
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

const HeaderNavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpenState = () => setIsOpen((prev) => !prev);
  return (
    <div>
      <button
        disabled={isOpen}
        data-cy='nav-mobile-open-btn'
        onClick={toggleOpenState}
        className={cn({ invisible: isOpen })}
      >
        <IoMenuOutline className='w-7 h-7 text-gray-900 hover:text-gray-800' />
      </button>
      {/* Nav bar  */}
      <nav
        data-cy='nav-mobile'
        className={cn(
          "w-screen-h-screen inset-0 flex justify-center z-50 bg-white/90 fixed inset-y-0 translate-x-full duration-500",
          {
            "translate-x-0": isOpen,
          }
        )}
      >
        <button
          className='z-50'
          disabled={!isOpen}
          data-cy='nav-mobile-close-btn'
          onClick={toggleOpenState}
        >
          <IoCloseOutline className='absolute w-7 h-7 top-3 right-6 hover:text-red-600 ' />
        </button>
        <ul className='flex flex-col gap-5 mt-20'>
          {LINKS.map((link) => (
            <NavItem onClose={toggleOpenState} key={link.label} {...link} />
          ))}
          <NavItem
            onClose={toggleOpenState}
            label='Login'
            href={APP_URL.login}
          />
          <NavItem
            onClose={toggleOpenState}
            label='Sign up'
            href={APP_URL.signUp}
          />
        </ul>
      </nav>
    </div>
  );
};

export default HeaderNavMobile;

interface NavItemProps extends ILink {
  onClose: () => void;
}
const NavItem = ({ onClose, href, label }: NavItemProps) => {
  const pathName = usePathname();

  return (
    <li
      data-cy='nav-item-mobile'
      className='text-2xl font-semibold text-center'
    >
      <Link
        className={cn({ "text-primary": pathName === href })}
        onClick={onClose}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
};
