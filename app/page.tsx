'use client';

//HELPER COMPONENTS
import MobileHeader from './components/MobileHeader';
import DesktopHeader from './components/DesktopHeader';
import Sidebar from './components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import Recommendations from './components/Recommendations';

//IMPORTING HOOKS
import { useState, useEffect } from 'react';

//IMPORTING DEPS
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

//IMPORTING PAGE ASSETS
import logo from '@/public/ninja-logo.webp';
import image1 from '@/public/1.webp';
import image2 from '@/public/2.webp';
import image3 from '@/public/3.webp';
import image4 from '@/public/4.webp';
import image5 from '@/public/5.webp';
import image6 from '@/public/6.webp';
import image7 from '@/public/7.webp';
import image8 from '@/public/8.webp';
import image9 from '@/public/9.webp';
import image10 from '@/public/10.webp';
import image11 from '@/public/11.png';
import image12 from '@/public/12.png';
import image13 from '@/public/13.png';
import productImage from '@/public/15.webp';
import Popular from './components/Popular';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const products = await axios.get(`${DEV_API}/product/get-all-products`);
      } catch (error: any) {
        console.log(error);
        toast.error(error);
      }
    };

    getAllProducts();
  }, []);

  const submitEmail = () => {
    alert('Email submitted');
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

      {/* HERO SECTION */}
      <section className="">
        <ToastContainer />
        <div className="relative mt-15 md:mt-40">
          <div className="absolute top-o left-o w-screen h-162.5 overflow-hidden -z-10 ">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="px-5 relative top-60 md:px-10 lg:px-15">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl md:w-[60%]">
            {' '}
            Innovative Kitchen Appliances Designed For Life{' '}
          </h1>
          <button className="bg-[#D85827] text-white font-semibold text-xl py-2 px-4 rounded-xl mt-5 hover:scale-110 transition-all duration-300 cursor-pointer">
            {' '}
            Shop Now{' '}
          </button>
        </div>
      </section>

      {/* BONUSES */}
      <section className="flex flex-col gap-5 mt-150 px-5 md:px-10 lg:px-15 md:flex-row">
        <Link href={'/all-products'}>
          <div>
            <Image src={image11} alt="" />
          </div>
        </Link>

        <div className="flex flex-col gap-5">
          <Link href={'/all-products'}>
            {' '}
            <Image src={image12} alt="" />
          </Link>
          <Link href={'/all-products'}>
            {' '}
            <Image src={image13} alt="" />
          </Link>
        </div>
      </section>

      {/* POPULAR */}
      <Popular />

      {/* RECOMMENDATIONS */}
      <Recommendations />

      {/* FOOTER */}
      <footer className="mt-15 px-5 py-5 md:px-10 md:mt-20 lg:px-15 lg:mt-25 bg-gray-200 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Image src={logo} alt="" className="w-24" />
          <span className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Email"
              className="py-2 px-4 outline-none bg-white rounded-lg border"
            />
            <button
              onClick={submitEmail}
              className="bg-black text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
            >
              SUBSCRIBE
            </button>
          </span>
        </div>

        <div className="text-gray-700">Copyright Ninja Kitchen tools</div>
      </footer>
    </>
  );
};

export default Home;
