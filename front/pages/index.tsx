import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { RequiredMark } from '../components/RequiredMark';
import { axiosApi } from '../lib/axios';

type LoginForm = {
  email: string;
  password: string;
}
type Validation = LoginForm  & { loginFailed: string };

const Home: NextPage = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>(
    { email: '', 
      password: '' 
    });

  const [validation, setValidation] = useState<Validation>({
    email: '',
    password: '',
    loginFailed: '',
  });

  const router = useRouter();

  const updateLoginForm = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  console.log(loginForm);

  const login = () => {
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // ログイン処理
        axiosApi
          .post('/login', loginForm)
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
    <div className='w-2/3 py-24 mx-auto'>
      <div className='w-1/2 px-12 py-16 mx-auto border-2 rounded-2xl'>
        <h3 className='mb-10 text-2xl text-center'>ログイン</h3>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>メールアドレス</p>
            <RequiredMark />
          </div>
          <input
            className='w-full p-2 border rounded-md outline-none'
            name='email'
            value={loginForm.email}
            onChange={updateLoginForm}
          />
          {/* <p className='py-3 text-red-500'>必須入力です。</p> */}
        </div>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>パスワード</p>
            <RequiredMark />
          </div>
          <small className='block mb-2 text-gray-500'>
            8文字以上の半角英数字で入力してください
          </small>
          <input
            className='w-full p-2 border rounded-md outline-none'
            name='password'
            type='password'
            value={loginForm.password}
            onChange={updateLoginForm}
          />
          {/* <p className='py-3 text-red-500'>
            8文字以上の半角英数字で入力してください。
          </p> */}
        </div>
        <div className='mt-12 text-center'>
          {/* <p className='py-3 text-red-500'>
            IDまたはパスワードが間違っています。
          </p> */}
          <button className='px-10 py-3 bg-gray-700 cursor-pointer text-gray-50 sm:px-20 rounded-xl drop-shadow-md hover:bg-gray-600' onClick={login}>
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
