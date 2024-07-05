import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/input';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '~/config/firebase';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '~/redux/user/userSlice';
import { toast } from 'react-toastify';
import { Button } from '~/components/button';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

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
  const [userListing, setUserListing] = useState([]);
  const [showListing, setShowListing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idListingDelete, setIdListingDelete] = useState('');

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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:3000/v1/users/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error('Delete user failed');
        return;
      }
      dispatch(deleteUserSuccess());
      toast.success(data.message);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error('Delete user failed');
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('http://localhost:3000/v1/auth/signout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      toast.success(data.message);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error('Sign out failed');
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`http://localhost:3000/v1/users/listings/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error('Error showing listings');
        return;
      }
      setUserListing(data.listings);
    } catch (error) {
      toast.error('Error showing listings');
      console.log(error);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/v1/listing/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error('Error deleting listing');
        setShowConfirmation(false);
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== id));
      setShowConfirmation(false);
      setIdListingDelete('');
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Error deleting listing');
      setIdListingDelete('');
      console.log(error);
      setShowConfirmation(false);
    }
  };

  // Dialog

  const handleCancel = () => {
    toast.done('Delete cancelled!');
    setShowConfirmation(false);
    setIdListingDelete('');
  };

  return (
    <div className='max-w-lg p-3 mx-auto mb-7'>
      {/* Dialog */}
      <div>
        {showConfirmation && (
          <div className='fixed inset-0 flex items-center justify-center'>
            <div className='p-8 bg-white rounded-lg'>
              <p>Are you sure you want to delete?</p>
              <div className='flex justify-end mt-4'>
                <button
                  type='button'
                  className='px-4 py-2 mr-2 text-white bg-red-500 rounded'
                  onClick={() => handleDeleteListing(idListingDelete)}
                >
                  Confirm
                </button>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-300 rounded'
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
        <Link to='/create-listing'>
          <Button className='w-full bg-green-700' type='submit'>
            Create listing
          </Button>
        </Link>
      </form>
      <div className='flex justify-end gap-3 mt-5'>
        <span
          onClick={() => {
            handleShowListings();
            setShowListing(!showListing);
          }}
          className='p-2 text-white bg-green-700 rounded-md cursor-pointer hover:bg-red-500'
        >
          Show Listing
        </span>
        <span
          onClick={handleDeleteUser}
          className='p-2 text-white bg-red-700 rounded-md cursor-pointer hover:bg-red-500'
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className='p-2 text-white bg-red-700 rounded-md cursor-pointer hover:bg-red-500'
        >
          Sign out
        </span>
      </div>
      {showListing && userListing && userListing.length > 0 && (
        <div className='flex flex-col gap-3 my-7'>
          <h1 className='text-2xl font-semibold text-center mb-7'>Your Listings</h1>
          {userListing.map((listing) => (
            <div
              key={v4()}
              className='flex items-center justify-between gap-3 p-3 border rounded-lg'
            >
              <Link className='flex items-center gap-3' to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='object-contain w-16 h-16 rounded-lg'
                />
                <p className='flex-1 font-semibold truncate hover:underline'>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center gap-2'>
                <Button
                  onClick={() => {
                    setShowConfirmation(true);
                    setIdListingDelete(listing._id);
                  }}
                  type='button'
                  className='bg-red-500 w-full max-w-[84px] !p-1'
                >
                  Delete
                </Button>
                <Button type='button' className='w-full max-w-[84px] bg-slate-500 !p-1'>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
