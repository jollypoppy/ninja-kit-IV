//IMPORTING HOOKS
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

//IMPORTING DEPS
import axios from 'axios';

//IMPORTING HELPER COMPONENTS
import ProductCard from './ProductCard';

//IMPORTING TYPES AND INTERFACES
import IProduct from '../interfaces/IProduct';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<IProduct[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${DEV_API}/product/get-recommendations`,
        );

        setRecommendations(response.data.data);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(error.response.message);
        setIsLoading(false);
      }
    };
    getRecommendations();
  }, []);

  return (
    <section className="mt-15 px-5 py-5 md:px-10 md:mt-20 lg:px-15 lg:mt-25 bg-gray-200">
      <ToastContainer />
      <h1 className="text-2xl font-semibold md:text-3xl">
        Recommendations for you
      </h1>

      <div className="mt-10 flex justify-between overflow-scroll">
        {isLoading ? (
          <span className="block loading loading-ring loading-xl w-25 text-gray-600 mx-auto"></span>
        ) : (
          recommendations?.map((item: IProduct, i: number) => {
            const { title, picture, price, _id } = item;
            return (
              <ProductCard
                key={i}
                title={title}
                picture={picture}
                price={price}
                productId={_id}
              />
            );
          })
        )}
      </div>
    </section>
  );
};

export default Recommendations;
