'use client';

//IMPORTING HOOKS AND DEPS
import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

//IMPORTING HELPER COMPONENTS
import MobileHeader from '@/app/components/MobileHeader';
import DesktopHeader from '@/app/components/DesktopHeader';
import Sidebar from '@/app/components/Sidebar';
import axios from 'axios';

interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const Profile = () => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;
  const { token, user } = useAppContext();
  const router = useRouter();

  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${DEV_API}/auth/get-user/${user}`);
        setUserDetails(res.data.data);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error.response);
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('ninja-token');
    localStorage.removeItem('ninja-user');
    localStorage.removeItem('ninja-cart');

    router.push('/');
    toast.success('You have successfully logged out!');
  };

  if (isLoading) {
    return (
      <section className="flex justify-center mt-70">
        <span className="loading loading-ring loading-xl w-25 tet-gray-500 block"></span>
      </section>
    );
  }

  if (!token) {
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
        <section className="mt-30 p-5 md:p-10 lg:p-15 xl:p-20 flex flex-col gap-10">
          <div>
            <h1 className="text-center text-xl font-semibold text-gray-700">
              {' '}
              You are not logged in, please click the buttons below to login or
              register{' '}
            </h1>
          </div>

          <div>
            <span className="flex gap-5 justify-center">
              <button
                onClick={() => {
                  router.push('/login');
                }}
                className="text-white bg-black rounded-lg py-3 px-5 w-60 text-center font-semibold  cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  router.push('/sign-up');
                }}
                className="text-white bg-black rounded-lg py-3 px-5  w-60 text-center font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </span>
          </div>
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

      <section className="mt-20 flex flex-col gap-3 p-5 md:p-10 md:mt-30 lg:p-15 xl:p-20">
        <h1 className="text-center text-2xl text-gray-700 font-semibold">
          {' '}
          Profile details{' '}
        </h1>
        <p className="text-xl text-gray-700 font-semibold">
          First name: {userDetails?.firstName}
        </p>
        <p className="text-xl text-gray-700 font-semibold">
          Last name: {userDetails?.lastName}
        </p>
        <p className="text-xl text-gray-700 font-semibold">
          Email name: {userDetails?.email}
        </p>

        <button
          onClick={logout}
          className="py-2 px-4 bg-black text-white rounded-lg text-lg font-semibold flex justify-center cursor-pointer w-[60%] mx-auto mt-20 hover:scale-105 transition-all duration-200"
        >
          {' '}
          Logout{' '}
        </button>
      </section>
    </>
  );
};

export default Profile;
