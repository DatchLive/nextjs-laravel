import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { axiosApi } from '../../lib/axios';

type Memo = {
  title: string;
  body: string;
};

const Memo: NextPage = () => {
  const router = useRouter();

  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    axiosApi
      .get('/api/memos')
      .then((response: AxiosResponse) => {console.log(response.data); setMemos(response.data.data);})
      .catch((err: AxiosError) => console.log(err.response));
  }, []);

  return (
    <div className='w-2/3 mx-auto mt-32'>
      <div className='w-1/2 mx-auto text-center'>
        <button
          className='px-10 py-3 mb-12 text-xl text-white bg-blue-500 rounded-3xl drop-shadow-md hover:bg-blue-400'
          onClick={() => router.push('/memos/post')}
        >
          メモを追加する
        </button>
      </div>
      <div className='mt-3'>
        {/* 仮データでの一覧表示 */}
        <div className='grid w-2/3 grid-cols-2 gap-4 mx-auto'>
          {memos.map((memo: Memo, index) => {
            return (
              <div className='p-4 mb-5 bg-gray-100 shadow-lg' key={index}>
                <p className='mb-1 text-lg font-bold'>{memo.title}</p>
                <p className=''>{memo.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Memo;
