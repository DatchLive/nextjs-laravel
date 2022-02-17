import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { RequiredMark } from '../../components/RequiredMark';
import { axiosApi } from '../../lib/axios';

type MemoForm = {
  title: string;
  body: string;
};

const Post: NextPage = () => {
  const router = useRouter();
  
  const [memoForm, setMemoForm] = useState<MemoForm>({
    title: '',
    body: '',
  });
  const [validation, setValidation] = useState<MemoForm>({
    title: '',
    body: '',
  });

  const updateMemoForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMemoForm({ ...memoForm, [e.target.name]: e.target.value });
  };

  const createMemo = () => {
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // APIへのリクエスト
        axiosApi
          .post('/api/memos', memoForm)
          .then((response: AxiosResponse) => {
            console.log(response.data);
            router.push('/memos');
          })
          .catch((err: AxiosError) => {
            console.log(err.response);
          });
      });
  };

  return (
    <div className='w-2/3 mx-auto'>
      <div className='w-1/2 px-12 py-16 mx-auto mt-32 border-2 rounded-2xl'>
        <h3 className='mb-10 text-2xl text-center'>メモの登録</h3>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>タイトル</p>
            <RequiredMark />
          </div>
          <input
            className='w-full p-2 border rounded-md outline-none'
            name='title'
            value={memoForm.title}
            onChange={updateMemoForm}
          />
        </div>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>メモの内容</p>
            <RequiredMark />
          </div>
          <textarea
            className='w-full p-2 border rounded-md outline-none'
            name='body'
            cols={30}
            rows={4}
            value={memoForm.body}
            onChange={updateMemoForm}
          />
        </div>
        <div className='text-center'>
          <button className='px-10 py-3 mt-8 bg-gray-700 cursor-pointer text-gray-50 sm:px-20 rounded-xl drop-shadow-md hover:bg-gray-600' onClick={createMemo}>
            登録する
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
