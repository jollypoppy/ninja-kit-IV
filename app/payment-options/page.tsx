'use client';

//IMPORTING HELPER COMPONENTS
import MobileHeader from '../components/MobileHeader';
import DesktopHeader from '../components/DesktopHeader';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';

//IMPORTING HOOKS AND DEPS
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

//IMPORTING PAGE ASSETS
import venmo from '@/public/payment-options/venmo.webp';
import cashapp from '@/public/payment-options/cashapp.webp';
import apple from '@/public/payment-options/apple3.png';
import zelle from '@/public/payment-options/zelle.png';
import { useAppSelector } from '../lib/hooks';

const PaymentOptionsPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const DEV_API = process.env.NEXT_PUBLIC_API_URL;
  const { user, token } = useAppContext();
  const cart = useAppSelector((store) => store.cartReducer);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const sellerId = '6988e97855e9a3d54af22435';

  const buyNow = async (paymentOption: string) => {
    try {
      if (!token || !user) {
        toast.error('Please login to continue');
        router.push('/profile');
        return;
      }
      if (isLoading) {
        return;
      }

      if (cart.length === 0) {
        toast.error('Your cart is empty!');
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${DEV_API}/chat/get-or-create`, {
        productIds: cart,
        buyerId: user,
        sellerId,
        chatId: null,
        paymentOption,
      });

      router.push(`/customer-care-chat/${response.data.data.chatId}`);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {pageWidth < 760 ? (
        <MobileHeader setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <DesktopHeader />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <section className="mt-40 p-5 md:p-10 lg:p-15 xl:p-20">
        <div>
          <h1 className="text-2xl text-center text-gray-700 font-semibold">
            {' '}
            Select a payment method{' '}
          </h1>
          <p className="text-gray-700 font-semibold">Paying with:</p>
        </div>

        <div className="mt-5 flex flex-col gap-5 items-center">
          <span
            onClick={() => {
              buyNow('venmo');
            }}
            className="flex items-center gap-3 border border-gray-600 rounded-lg p-3 w-[60%] cursor-pointer"
          >
            <Image src={venmo} alt="" className="w-15 h-15 rounded-lg" />
            <p className="text-lg text-gray-700 font-semibold">Venmo</p>
          </span>

          <span
            onClick={() => {
              buyNow('cashapp');
            }}
            className="flex items-center gap-3 border border-gray-600 rounded-lg p-3 w-[60%] cursor-pointer"
          >
            <Image src={cashapp} alt="" className="w-15 h-15 rounded-lg" />
            <p className="text-lg text-gray-700 font-semibold">Cashapp</p>
          </span>

          <span
            onClick={() => {
              buyNow('apple-pay');
            }}
            className="flex items-center gap-3 border border-gray-600 rounded-lg p-3 w-[60%] cursor-pointer"
          >
            <Image src={apple} alt="" className="w-15 h-15 rounded-lg" />
            <p className="text-lg text-gray-700 font-semibold">Apple Pay</p>
          </span>

          <span
            onClick={() => {
              buyNow('zelle');
            }}
            className="flex items-center gap-3 border border-gray-600 rounded-lg p-3 w-[60%] cursor-pointer"
          >
            <Image src={zelle} alt="" className="w-15 h-15 rounded-lg" />
            <p className="text-lg text-gray-700 font-semibold"> Zelle </p>
          </span>
        </div>
      </section>
    </>
  );
};

export default PaymentOptionsPage;
