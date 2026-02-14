'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

//IMPORTING HELPER COMPONENTS
import MobileHeader from '@/app/components/MobileHeader';
import DesktopHeader from '@/app/components/DesktopHeader';
import Sidebar from '@/app/components/Sidebar';

const LoginPage = () => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setUserDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const login = async () => {
    try {
      const { email, password } = userDetails;
      setIsLoading(true);

      const response = await axios.post(`${DEV_API}/auth/user-login`, {
        email,
        password,
      });

      localStorage.setItem('ninja-token', response.data.data.token);
      localStorage.setItem('ninja-user', response.data.data.userId);
      window.location.reload();
      setIsLoading(false);
      window.location.replace('/');
    } catch (error: any) {
      console.log(error.response);
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
      <section className="p-5 md:p-10 lg:p-15 xl:p-20 flex flex-col gap-5">
        <div>
          <h1 className="text-center text-2xl text-gray-700 font-semibold mt-30">
            {' '}
            Enter your details to log into your account{' '}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            name="email"
            value={userDetails.email}
            placeholder="Enter your Email"
            onChange={handleChange}
            className="py-2 px-4 rounded-lg border-2  w-80"
          />

          <input
            type="password"
            name="password"
            value={userDetails.password}
            placeholder="Password"
            onChange={handleChange}
            className="py-2 px-4 rounded-lg border-2  w-80"
          />

          <button
            onClick={login}
            className="text-white bg-black rounded-lg py-3 px-5  w-80 text-center font-semibold cursor-pointer"
          >
            {isLoading ? (
              <span className=" loading loading-ring loading-xl font-bold text-white block mx-auto"></span>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
