import Link from "next/link";
import { IoCartOutline, IoPersonOutline } from "react-icons/io5";
import { APP_URL } from "@/constants/navigation.constant";
import HeaderNavMobile from "./header-nav-mobile";
import HeaderCart from "./header-cart/header-cart";

const Header = () => {
  return (
    <header className='h-20 px-6 flex justify-between items-center shadow border-b border-b-zinc-100'>
      {/* Logo */}
      <Link data-cy='header-logo' href={APP_URL.home}>
        <h2>Logo</h2>
      </Link>
      <div className='flex gap-4 h-full items-center'>
        <HeaderCart />
        <Link href={APP_URL.myProfile}>
          <IoPersonOutline className='w-7 h-7 text-gray-800 hover:text-gray-800' />
        </Link>
        <HeaderNavMobile />
      </div>
    </header>
  );
};

export default Header;
