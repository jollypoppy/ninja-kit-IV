//IMPORTING COMOPONENT ASSETS
import logo from '@/public/ninja-logo.webp';
import search from '@/public/search.png';
import person from '@/public/user.png';
import bag from '@/public/shopping-bag.png';

//IMPORTING HELPER COMPONENTS
import Image from 'next/image';
import Link from 'next/link';

//STATE MANAGEMENT
import { useAppSelector } from '../lib/hooks';

const DesktopHeader = () => {
  const cart = useAppSelector((state) => state.cartReducer);

  return (
    <header className="p-5 bg-white fixed top-0 left-0 w-full z-50">
      <section className="flex items-center justify-between">
        <div>
          <Link href={'/'}>
            {' '}
            <Image src={logo} alt="Ninja Logo" className="w-25" />{' '}
          </Link>
        </div>

        <div className="relative flex items-center w-[60%]">
          <input
            type="text"
            placeholder="I'm shopping for ..."
            className="bg-gray-200 rounded-2xl py-2 px-4 w-full"
          />

          <Image
            src={search}
            alt="The search button"
            className="w-8 absolute top-o left-[91%] lg:left-[95%]"
          />
        </div>

        <div className="flex items-center gap-4">
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
          <Link href={'/profile'}>
            {' '}
            <span>
              <Image src={person} alt="Shopping cart" className="w-8" />
            </span>
          </Link>
        </div>
      </section>

      <section className="w-[90%] mx-auto mt-8">
        <ul className="flex text-sm gap-3 font-semibold justify-center">
          <Link href={'/all-products'}>
            {' '}
            <li> Shop All </li>
          </Link>
          <Link href={'/kitchen-appliances'}>
            {' '}
            <li> Kitchen Appliances </li>
          </Link>
          <Link href={'/blenders-and-juicers'}>
            {' '}
            <li> Blenders & Juicers </li>
          </Link>
          <Link href={'/kitchenware'}>
            {' '}
            <li> Kitchenware </li>
          </Link>
          <Link href={'/accessories-and-parts'}>
            {' '}
            <li> Accessories & Parts </li>
          </Link>
          <Link href={'/bundle-and-save'}>
            <li> Bundle & Save </li>
          </Link>
        </ul>
      </section>
    </header>
  );
};

export default DesktopHeader;
