import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '~/components/input';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('This field is required'),
  password: yup.string().required('This field is required').min(8, 'Password must be 8 character'),
});

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSignIn = async (values) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/v1/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      toast.success('Login successfully');
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <div className='h-screen max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form className={`flex flex-col gap-6`} onSubmit={handleSubmit(handleSignIn)}>
        <Input
          control={control}
          error={errors.email?.message}
          placeholder='Email'
          name='email'
        ></Input>
        <Input
          control={control}
          error={errors.password?.message}
          placeholder='Password'
          type='password'
          name='password'
        ></Input>
        <button
          disabled={isLoading}
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5 '>
        <p>Dont have an account? </p>
        <Link to='/sign-up'>
          <strong className='text-blue-700'>Sign un</strong>
        </Link>
      </div>
    </div>
  );
}
