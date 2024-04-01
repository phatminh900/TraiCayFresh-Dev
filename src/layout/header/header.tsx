import Link from "next/link";
import { IoCartOutline ,IoPersonOutline} from "react-icons/io5";
import { APP_URL } from "@/constants/navigation.constant";
import HeaderNavMobile from "./header-nav-mobile";

const Header = () => {
  return (
    <header className='h-20 px-6 flex justify-between items-center shadow border-b border-b-zinc-100'>

      {/* Logo */}
      <div>
        <h2>Logo</h2>
      </div>
      <div className="flex gap-4 h-full items-center">
        <Link href={APP_URL.cart}>
            <IoCartOutline  className="w-7 h-7 text-gray-800 hover:text-gray-800"/>
        </Link>
        <Link href={APP_URL.myProfile}>
            <IoPersonOutline  className="w-7 h-7 text-gray-800 hover:text-gray-800"/>
        </Link>
        <HeaderNavMobile />
      </div>
    </header>
  );
};

export default Header;
