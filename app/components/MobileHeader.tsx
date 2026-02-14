//IMPORTING HOOKS
import React from 'react';

//IMPORTING COMPONENT ASSETS
import logo1 from '@/public/ninja-logo.webp';
import search from '@/public/search.png';
import menu from '@/public/menu.png';
import bag from '@/public/shopping-bag.png';
import person from '@/public/user.png';

//IMPORTING HELPER COMPONENTS
import Image from 'next/image';
import Link from 'next/link';

//STATE MANAGEMENT
import { useAppSelector } from '../lib/hooks';

const MobileHeader = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const cart = useAppSelector((state) => state.cartReducer);
  return (
    <header className="p-4 shadow-sm bg-white fixed top-0 left-0 w-full z-50">
      {/*    <div className="py-4 bg-gray-100">
        <p className="text-center text-gray-600">
          Up to 80% Off & Free Shipping{' '}
        </p>
      </div> */}

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Image
            src={menu}
            alt="The menu button"
            className="w-8 cursor-pointer"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          />
          <Image src={search} alt="The search button" className="w-8" />
        </span>

        <span>
          <Link href={'/'}>
            {' '}
            <Image src={logo1} alt="Ninja logo" className="w-12" />
          </Link>
        </span>

        <span className="flex items-center gap-1">
          <Link href={'/profile'}>
            <span>
              <Image src={person} alt="Login/Signup" className="w-8" />
            </span>
          </Link>
          <Link href={'/cart'}>
            {' '}
            <span className=" block relative">
              {cart.length > 0 ? (
                <span className=" w-5 h-5 bg-white border absolute top-[60%] left-[60%] rounded-full flex items-center justify-center text-xs font-semibold">
                  {cart.length}
                </span>
              ) : (
                ''
              )}
              <Image src={bag} alt="Shopping cart" className="w-8" />
            </span>{' '}
          </Link>
        </span>
      </div>
    </header>
  );
};

export default MobileHeader;
