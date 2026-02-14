'use client';

//IMPORTING HELPER COMPONENTS
import DesktopHeader from '@/app/components/DesktopHeader';
import MobileHeader from '@/app/components/MobileHeader';
import Sidebar from '@/app/components/Sidebar';
import Image from 'next/image';

//IMPORTING PAGE ASSETS
import bin from '@/public/bin.png';

//STATE MANAGEMENT
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { removeFromCart } from '@/app/lib/features/cart/cartSlice';

//IMPORT DEPS
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import { toast } from 'react-toastify';

//IMPORTING TYPES AND INTERFACES
import IProduct from '@/app/interfaces/IProduct';

const CartPage = () => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartDetails, setCartDetails] = useState<IProduct[]>();

  const cart = useAppSelector((state) => state.cartReducer);
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getCartProducts = async () => {
      try {
        setIsLoading(true);
        const products = await axios.get(
          `${DEV_API}/product/get-particular-products?productIds=${cart.join(',')}`,
        );

        setCartDetails(products.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    getCartProducts();
  }, []);

  const removeItem = (productId: string | undefined) => {
    setCartDetails((prevDetails) => {
      const newState = prevDetails?.filter((item) => item._id !== productId);
      return newState;
    });
  };

  const { user, token } = useAppContext();
  const sellerId = '6988e97855e9a3d54af22435';

  const proceedToCheckoutChat = async () => {
    try {
      if (isLoading) {
        return;
      }

      if (!user || !token) {
        router.push('/profile');
        return;
      }
      setIsLoading(true);

      router.push(`/payment-options`);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  if (!cart.length) {
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

        <section className="mt-50 text-center text-2xl font-semibold text-gray-700 p-3">
          <h2> You do not have any items in your cart </h2>
        </section>
      </>
    );
  }

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

      {isLoading ? (
        <section className="flex justify-center mt-70">
          <span className="loading loading-ring loading-xl w-25 tet-gray-500 block"></span>
        </section>
      ) : (
        <section className="mt-25 px-5 md:mt-40 md:px-10 lg:px-15 xl:px-20">
          <div className="flex flex-col gap-5">
            {cartDetails?.map((cartItem: IProduct, i: number) => {
              return (
                <div
                  key={i}
                  className="flex items-center border border-gray-300 rounded-lg p-3 justify-between"
                >
                  <div className="flex items-center gap-3 w-[80%]">
                    <span className="block w-24 h-24 relative border border-gray-200 rounded-lg">
                      <Image src={cartItem.picture} alt="" fill />
                    </span>
                    <span className="text-sm font-semibold w-[80%]">
                      <h2 className="text-gray-700"> {cartItem.title} </h2>
                      <p className="text-gray-500"> ${cartItem.price}</p>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      dispatch(removeFromCart(cartItem._id));
                      removeItem(cartItem._id);
                    }}
                    className="w-10 h-10 border border-gray-400 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 active:bg-gray-300"
                  >
                    {' '}
                    <Image src={bin} alt="" className="w-full h-full" />{' '}
                  </button>
                </div>
              );
            })}

            <div className="flex justify-center gap-3">
              <button
                onClick={proceedToCheckoutChat}
                className="bg-green-400 py-2 px-5 rounded-lg text-white text-lg transition-all duration-200 hover:scale-102 cursor-pointer active:bg-green-500 font-semibold"
              >
                {' '}
                Proceed to checkout{' '}
              </button>

              <button
                onClick={() => {
                  router.push('/purchases-list');
                }}
                className="bg-blue-400 py-2 px-5 rounded-lg text-white text-lg transition-all duration-200 hover:scale-102 cursor-pointer active:bg-blue-500 font-semibold"
              >
                Purchases
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CartPage;
