//IMPORTING DEPS
import axios from 'axios';
import { toast } from 'react-toastify';

//IMPORTING HELPER COMPONENTS
import Image from 'next/image';
import IProduct from '../interfaces/IProduct';

const AdminProductCard = ({
  title,
  price,
  picture,
  productId,
  setProducts,
}: {
  title: string;
  price: number;
  picture: string;
  productId: string | undefined;
  setProducts: Function;
}) => {
  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  const deleteProduct = async () => {
    try {
      await axios.delete(`${DEV_API}/product/delete-product/${productId}`);

      setProducts((prevProducts: IProduct[]) => {
        const newState = prevProducts.filter((item) => item._id !== productId);
        return newState;
      });
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-64 h-90 flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg p-1">
      <span className="block h-80 relative">
        <Image src={picture} alt="" fill />
      </span>

      <span>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-700">${price}</p>
      </span>

      <button
        onClick={deleteProduct}
        className="p-2 bg-red-400 rounded-lg text-white font-semibold cursor-pointer"
      >
        Delete Product
      </button>
    </div>
  );
};

export default AdminProductCard;
