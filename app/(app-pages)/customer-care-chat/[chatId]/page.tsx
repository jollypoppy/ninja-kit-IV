'use client';

//IMPORTING HELPER COMPONENTS
import Sidebar from '@/app/components/Sidebar';
import MobileHeader from '@/app/components/MobileHeader';
import DesktopHeader from '@/app/components/DesktopHeader';

//IMPORTING HOOKS AND DEPS
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getSocket } from '@/app/lib/socket';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import { useAppSelector } from '@/app/lib/hooks';
import IProduct from '@/app/interfaces/IProduct';

type Message = {
  senderId: string;
  text: string;
};

export default function ChatPage({
  buyerId,
  sellerId,
  productId,
}: {
  buyerId: string;
  sellerId: string;
  productId: string;
}) {
  //UTILISING HOOKS
  const params = useParams();
  const { chatId } = params;
  const { user } = useAppContext();
  const cart = useAppSelector((store) => store.cartReducer);

  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [products, setProducts] = useState<IProduct[]>();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [text, setText] = useState('');

  const DEV_API = process.env.NEXT_PUBLIC_API_URL;

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      const res = await axios.post(`${DEV_API}/chat/get-or-create`, {
        buyerId: user,
        sellerId: '6988e97855e9a3d54af22435',
        productIds: cart,
        chatId,
      });

      console.log(res.data.data);

      setProducts(res.data.data.products);

      setMessages(res.data.data.messages);

      setPaymentMethod(res.data.data.paymentOption);

      const socket = getSocket();
      socket.emit('join-chat', chatId);

      socket.on('receive-message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });
    };

    initChat();

    return () => {
      const socket = getSocket();
      socket.off('receive-message');
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!text || !chatId) return;

    getSocket().emit('send-message', {
      chatId,
      senderId: user,
      text,
    });

    setText('');
  };

  useEffect(() => {
    setPageWidth(window.innerWidth);

    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {' '}
      {pageWidth < 760 ? (
        <MobileHeader setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <DesktopHeader />
      )}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="p-5 mt-20 md:mt-35">
        <div className="mb-10">
          <h1 className="text-2xl text-gray-700 font-semibold">
            {' '}
            Payment processing for:{' '}
          </h1>
          <ul className="text-gray-700 list-disc relative left-10">
            {products?.map((product: IProduct, i: number) => {
              return (
                <li key={i}>
                  {' '}
                  {product.title} - {product.price}{' '}
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-gray-700 font-semibold text-xl">
            Paying via:{' '}
            {paymentMethod.slice(0, 1).toUpperCase() + paymentMethod.slice(1)}
          </p>
        </div>

        <div className="h-[65vh] border rounded-lg overflow-y-auto p-3 mb-3 flex flex-col gap-3 md:h-[65vh]">
          {messages.map((msg, i) => (
            <span
              key={i}
              className={`flex ${msg.senderId === user ? 'justify-end' : ''}`}
            >
              <p
                className={`py-2 px-4 max-w-[70%] rounded-lg font-semibold ${msg.senderId === user ? 'text-right bg-gray-200 text-gray-700' : 'bg-blue-200 text-blue 700'} `}
              >
                {msg.text}
              </p>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border outline-none p-2 flex-1 rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="bg-black rounded-lg text-white px-4"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
