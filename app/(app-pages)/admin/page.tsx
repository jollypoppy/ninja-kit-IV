'use client';
//IMPORTING DEPS
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

//IMPORTING TYPES AND INTERFACES
import IProduct from '@/app/interfaces/IProduct';

//IMPORTING HELPER COMPONENTS
import AdminProductCard from '@/app/components/AdminProductCard';

const AdminPage = () => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [productDetails, setProductDetails] = useState<IProduct>({
    title: '',
    description: '',
    price: 0,
    category: '',
    picture: '',
  });
  const [products, setProducts] = useState<IProduct[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setProductDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const addProduct = async () => {
    try {
      setIsAddLoading(true);
      await axios.post(`${DEV_API}/product/add-product`, productDetails);

      setIsAddLoading(false);
      toast.success('Product added successfully!');

      setProductDetails({
        title: '',
        description: '',
        price: 0,
        category: '',
        picture: '',
      });
    } catch (error) {
      console.log(error);
      setIsAddLoading(false);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${DEV_API}/product/get-all-products`);
        setProducts(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <section>
      <div className="p-5">
        <h1 className="text-2xl font-semibold text-gray-600 text-center">
          {' '}
          Input product details here{' '}
        </h1>

        <span className="flex flex-col gap-2 mt-10">
          <input
            type="text"
            name="title"
            value={productDetails.title}
            placeholder="Product title"
            onChange={handleChange}
            className="py-2 px-4 border rounded-lg w-full"
          />
          <textarea
            name="description"
            value={productDetails.description}
            placeholder="Product description"
            onChange={handleChange}
            className="py-2 px-4 border rounded-lg w-full resize-none h-30"
          />
          <input
            type="number"
            name="price"
            placeholder="Product price"
            onChange={handleChange}
            className="py-2 px-4 border rounded-lg w-full"
          />
          <input
            type="text"
            name="category"
            placeholder="Product category"
            onChange={handleChange}
            className="py-2 px-4 border rounded-lg w-full"
          />
          <input
            type="text"
            name="picture"
            placeholder="Product picture URL"
            onChange={handleChange}
            className="py-2 px-4 border rounded-lg w-full"
          />

          <button
            onClick={addProduct}
            className="py-2 px-4 bg-black text-white rounded-lg text-lg font-semibold flex justify-center cursor-pointer"
          >
            {isAddLoading ? (
              <span className="loading loading-ring loading-xl font-bold text-white block"></span>
            ) : (
              ' Add Product'
            )}
          </button>

          <button
            onClick={() => {
              router.push('/admin/chats');
            }}
            className="py-2 px-4 bg-black text-white rounded-lg text-lg font-semibold flex justify-center cursor-pointer"
          >
            {isAddLoading ? (
              <span className="loading loading-ring loading-xl font-bold text-white block"></span>
            ) : (
              ' Admin chat'
            )}
          </button>
        </span>
      </div>

      {isLoading ? (
        <section className="flex justify-center mt-30">
          <span className="loading loading-ring loading-xl w-25 text-gray-500 block"></span>
        </section>
      ) : (
        <div className="flex flex-wrap items-center gap-4 p-5 mt-10">
          {products?.map((item: IProduct, i: number) => {
            return (
              <AdminProductCard
                key={i}
                title={item.title}
                price={item.price}
                picture={item.picture}
                productId={item._id}
                setProducts={setProducts}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AdminPage;
