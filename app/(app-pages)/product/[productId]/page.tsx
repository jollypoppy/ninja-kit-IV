'use client';

//IMPORTING HOOKS AND DEPS
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

//IMPORTING TYPES AND INTERFACES
import IProduct from '@/app/interfaces/IProduct';

//IMPORTING HELPER COMPONENTS
import MobileHeader from '@/app/components/MobileHeader';
import DesktopHeader from '@/app/components/DesktopHeader';
import Sidebar from '@/app/components/Sidebar';
import Image from 'next/image';

//STATE MANAGEMENT
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import { addToCart } from '@/app/lib/features/cart/cartSlice';

const page = ({ params }: { params: Promise<{ productId: string }> }) => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;
  const [productDetails, setProductDetails] = useState<IProduct>();
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const getProductData = async () => {
      try {
        const productData = await axios.get(
          `${DEV_API}/product/get-product/${(await params).productId}`,
        );
        setProductDetails(productData.data.data);
      } catch (error: any) {
        console.log(error);
        toast.error(error);
      }
    };

    getProductData();
  }, []);

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //GETTING THE STATE FOR THE CART
  const cart = useAppSelector((state) => state.cartReducer);
  const dispatch = useAppDispatch();

  if (!productDetails) {
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

        <section className="flex justify-center mt-70">
          <span className="loading loading-ring loading-xl w-25 tet-gray-500 block"></span>
        </section>
      </>
    );
  }

  const { title, description, price, picture, _id: productId } = productDetails;

  const buyNow = () => {
    dispatch(addToCart(productId));
    router.push('/payment-options');
  };

  return (
    <main>
      {pageWidth < 760 ? (
        <MobileHeader setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <DesktopHeader />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <section className="bg-gray-100 h-screen mt-15 p-5 md:mt-30 md:p-10 lg:p-15 xl:px-30">
        <div>
          <h1 className="text-xl font-semibold text-gray-700 lg:text-2xl">
            {' '}
            {title}{' '}
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-5 items-center lg:flex-row lg:gap-20">
          <div className="aspect-square  relative w-full">
            <Image src={picture} alt="" fill sizes="" />
          </div>

          <div className="flex flex-col gap-5 w-full">
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              {' '}
              {title}{' '}
            </h1>
            <h3 className="text-xl font-semibold text-gray-700 md:text-2xl">
              Hot Sales 🔥 - ${price}{' '}
            </h3>

            <span className="flex gap-5 justify-center">
              <button
                onClick={() => {
                  dispatch(addToCart(productId));
                }}
                className="text-white bg-red-400 rounded-lg py-3 px-5 w-full text-center font-semibold hover:bg-red-500 cursor-pointer"
              >
                {' '}
                ADD TO CART{' '}
              </button>
              <span
                onClick={buyNow}
                className="text-white bg-green-400 rounded-lg py-3 px-5  w-full text-center font-semibold hover:bg-green-500 cursor-pointer"
              >
                {' '}
                BUY NOW{' '}
              </span>
            </span>

            <span className="block text-gray-700">{description}</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
