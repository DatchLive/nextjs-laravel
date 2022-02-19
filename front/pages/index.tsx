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

type Validation = { 
  email?: string;
  password?: string;
  loginFailed?: string
};

const Home: NextPage = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>(
    { email: '', 
      password: '' 
    });

  const [validation, setValidation] = useState<Validation>({});

  const router = useRouter();

  const updateLoginForm = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const login = () => {

    setValidation({});
    
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
            if (err.response?.status === 422) {
              const errors = err.response?.data.errors;
              const validationMessages: { [index: string]: string } = {} as Validation;
              Object.keys(errors).map((key:string) => {
                validationMessages[key] = errors[key][0];
              });
              setValidation(validationMessages);
            }
            if (err.response?.status === 500) {
              alert('サーバーエラーが発生しました!!!!!!!!');
            }
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
          {validation.email && <p className='py-3 text-red-500'>{validation.email}</p>}
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
          {validation.password && <p className='py-3 text-red-500'>{validation.password}</p>}
        </div>
        <div className='mt-12 text-center'>
          {validation.loginFailed && <p className='py-3 text-red-500'>{validation.loginFailed}</p>}
          <button className='px-10 py-3 bg-gray-700 cursor-pointer text-gray-50 sm:px-20 rounded-xl drop-shadow-md hover:bg-gray-600' onClick={login}>
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
