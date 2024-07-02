import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/input';

const schema = yup.object({
  username: yup.string().required('This field is required'),
  email: yup.string().email('Invalid email address').required('This field is required'),
  password: yup.string().required('This field is required').min(8, 'Password must be 8 character'),
});

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const handleUpdateProfile = (values) => {
    console.log('🚀 ~ handleUpdateProfile ~ values:', values);
    return {};
  };
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className={`flex flex-col gap-6`} onSubmit={handleSubmit(handleUpdateProfile)}>
        <img
          src={currentUser.avatar}
          alt='avatar'
          className='self-center object-cover w-24 h-24 rounded-full cursor-pointer'
        />
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
        <button
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-50'
        >
          Update
        </button>
        <button
          type='submit'
          className='p-3 text-white uppercase bg-red-700 rounded-lg hover:opacity-95 disabled:opacity-50 '
        >
          Create listing
        </button>
      </form>
      <div className='flex justify-end gap-3 mt-5'>
        <span className='p-2 text-white bg-red-700 rounded-md cursor-pointer hover:bg-red-500'>
          Delete Account
        </span>
        <span className='p-2 text-white bg-red-700 rounded-md cursor-pointer hover:bg-red-500'>
          Sign out
        </span>
      </div>
    </div>
  );
}
