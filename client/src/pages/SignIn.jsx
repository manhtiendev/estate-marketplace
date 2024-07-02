import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '~/components/input';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '~/redux/user/userSlice';
import OAuth from '~/components/common/OAuth';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('This field is required'),
  password: yup.string().required('This field is required'),
});

export default function SignIn() {
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSignIn = async (values) => {
    dispatch(signInStart());
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
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.user));
      toast.success('Login successfully');
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
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
          disabled={loading}
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-50'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5 '>
        <p>Dont have an account? </p>
        <Link to='/sign-up'>
          <strong className='text-blue-700'>Sign up</strong>
        </Link>
      </div>
    </div>
  );
}
