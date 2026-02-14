import React from 'react';
//IMPORTING COMPONENT ASSETS
import image from '@/public/15.webp';

//IMPORTING HELPER COMPONENTS
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({
  title,

  price,
  picture,
  productId,
}: {
  title: string;
  price: number;
  picture: string;
  productId?: string;
}) => {
  return (
    <Link href={`/product/${productId}`}>
      <div className="w-64 h-90 flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
        <span className="block h-80 relative">
          <Image src={picture} alt="" fill />
        </span>

        <span>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="mt-2 text-gray-700">${price}</p>
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
