import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/input';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '~/config/firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '~/redux/user/userSlice';
import { toast } from 'react-toastify';
import { Button } from '~/components/button';

const schema = yup.object().shape(
  {
    username: yup
      .string()
      .required('This field is required')
      .when('username', {
        is: (value) => value?.length,
        then: (rule) => rule.min(8, 'Username must be at least 8 characters'),
      }),
    email: yup.string().email('Invalid email address').required('This field is required'),
    password: yup
      .string()
      .notRequired()
      .when('password', {
        is: (value) => value?.length,
        then: (rule) => rule.min(8, 'Password must be at least 8 characters'),
      }),
  },
  [
    ['password', 'password'],
    ['username', 'username'],
  ]
);

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileImage, setFileImage] = useState({});
  console.log('🚀 ~ Profile ~ fileImage:', fileImage);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        // switch (snapshot.state) {
        //   case 'paused':
        //     console.log('Upload is paused');
        //     break;
        //   case 'running':
        //     console.log('Upload is running');
        //     break;
        //   default:
        //     break;
        // }
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileImage({ avatar: downloadURL });
        });
      }
    );
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      avatar: currentUser.avatar,
      password: '',
    },
  });
  const handleUpdateProfile = async (values, e) => {
    e.preventDefault();
    const { password, ...rest } = values;
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3000/v1/users/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          password === '' ? { ...rest, ...fileImage } : { ...values, ...fileImage }
        ),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error('Update user failed');
        return;
      }
      dispatch(updateUserSuccess(data.user._doc));
      toast.success('User updated successfully');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error('Update user failed');
    }
  };

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className={`flex flex-col gap-6`} onSubmit={handleSubmit(handleUpdateProfile)}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/.*'
        />
        <img
          src={fileImage.avatar || currentUser.avatar}
          alt='avatar'
          className='self-center object-cover w-24 h-24 rounded-full cursor-pointer'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm text-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image upload (Image must be less than 2mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
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
        <Button disabled={loading} type='submit' isLoading={loading}>
          Update
        </Button>
        <Button className='bg-red-700' type='submit'>
          Create listing
        </Button>
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
