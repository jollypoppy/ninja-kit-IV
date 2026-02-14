'use client';

//IMPORTING HELPER COMPONENTS
import DesktopHeader from '@/app/components/DesktopHeader';
import MobileHeader from '@/app/components/MobileHeader';
import ProductCard from '@/app/components/ProductCard';
import Sidebar from '@/app/components/Sidebar';
import IProduct from '@/app/interfaces/IProduct';

//IMPORTING HOOKS AND DEPS
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AllProducts = () => {
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>();

  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getProductCategory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${DEV_API}/product/get-all-products`);
        setProducts(res.data.data);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
        setIsLoading(false);
      }
    };

    getProductCategory();
  }, []);

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
        <section className="flex justify-center mt-30">
          <span className="loading loading-ring loading-xl w-25 text-gray-500 block md:mt-50"></span>
        </section>
      ) : (
        <section>
          <div className="flex flex-wrap items-center gap-4 p-5 mt-15 md:mt-30 md:p-10 lg:p-15 xl:p-20 justify-center md:justify-between">
            {products?.map((item: IProduct, i: number) => {
              return (
                <ProductCard
                  key={i}
                  title={item.title}
                  price={item.price}
                  picture={item.picture}
                  productId={item._id}
                />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default AllProducts;
