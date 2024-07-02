import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '~/components/input';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import OAuth from '~/components/common/OAuth';

const schema = yup.object({
  username: yup.string().required('This field is required'),
  email: yup.string().email('Invalid email address').required('This field is required'),
  password: yup.string().required('This field is required').min(8, 'Password must be 8 character'),
  passwordConfirmation: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function SignUp() {
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

  const handleSignUp = async (values) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/v1/auth/signup', {
        method: 'POST',
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
      toast.success('Registration successful');
      navigate('/sign-in');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>
      <form className={`flex flex-col gap-6`} onSubmit={handleSubmit(handleSignUp)}>
        <Input
          control={control}
          error={errors.username?.message}
          placeholder='Username'
          name='username'
        ></Input>
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
        <Input
          control={control}
          placeholder='Password Confirm'
          type='password'
          name='passwordConfirmation'
          error={errors.passwordConfirmation?.message}
        ></Input>
        <button
          disabled={isLoading}
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5 '>
        <p>Have an account? </p>
        <Link to='/sign-in'>
          <strong className='text-blue-700'>Sign in</strong>
        </Link>
      </div>
    </div>
  );
}
