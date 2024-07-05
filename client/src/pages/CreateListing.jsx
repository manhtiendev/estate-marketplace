import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/input';
import * as yup from 'yup';
import { Textarea } from '~/components/textarea';
import { Button } from '~/components/button';
import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '~/config/firebase';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('This field is required')
    .min(8, 'Name must be greater than 8 characters')
    .max(62, 'Name must be less than 62 characters'),
  description: yup.string().required('This field is required'),
  address: yup.string().required('This field is required'),
  bedrooms: yup
    .number()
    .typeError('Bedrooms must be a number')
    .positive('Must be a positive value')
    .required('This field is required')
    .min(1, 'The bedroom must be larger than 1'),
  bathrooms: yup
    .number()
    .typeError('Bedrooms must be a number')
    .positive('Must be a positive value')
    .required('This field is required')
    .min(1, 'The bedroom must be larger than 1'),
  regularPrice: yup
    .number()
    .typeError('Price must be a number')
    .positive('Must be a positive value')
    .required('This field is required')
    .min(1, 'Listing price must be greater or equal then 1'),
  discountPrice: yup
    .number()
    .typeError('Price must be a number')
    .positive('Must be a positive value')
    .min(0, 'Listing discount price must be greater or equal then 0'),
  parking: yup.boolean().required(),
  furnished: yup.boolean().required(),
  offer: yup.boolean().required(),
});

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      type: ['sale'],
      regularPrice: 1,
      discountPrice: 0,
    },
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedOption, setSelectedOption] = useState(['sale']);
  const regularPrice = watch('regularPrice');
  const discountPrice = watch('discountPrice');
  const offer = watch('offer');

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + imageUrls.length < 7) {
      setLoadingImage(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setImageUrls([...imageUrls, ...urls]);
          toast.success('Image successfully uploaded');
          setLoadingImage(false);
        })
        .catch((err) => {
          toast.error('Failed to upload image');
          setLoadingImage(false);
          console.log(err);
        });
    } else {
      toast.error('You can only upload 6 images per listing');
      setLoadingImage(false);
    }
  };
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleOptionChange = (e) => {
    if (selectedOption !== e.target.value) {
      setSelectedOption(e.target.value);
    }
  };

  const handleCreateListing = async (values) => {
    try {
      if (imageUrls.length < 1) {
        toast.error('You must upload at least one image');
        return;
      }
      if (regularPrice < discountPrice) {
        toast.error('Discount price must be leaster than or equal regular price');
        return;
      }
      setLoading(true);
      const formData = { ...values, type: selectedOption.toString(), imageUrls: imageUrls };
      const res = await fetch('http://localhost:3000/v1/listing', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error('Create listing failed');
        setLoading(false);
        return;
      }
      setImageUrls([]);
      reset();
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      toast.error('Create listing failed');
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <main className='max-w-4xl p-3 mx-auto mb-7'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form
        onSubmit={handleSubmit(handleCreateListing)}
        className='flex flex-col gap-4 sm:flex-row'
      >
        <div className='flex flex-col flex-1 gap-6'>
          <Input
            type='text'
            placeholder='Name'
            error={errors.name?.message}
            name='name'
            control={control}
          ></Input>
          <Textarea
            control={control}
            name='description'
            placeholder='Description'
            error={errors.description?.message}
          ></Textarea>
          <Input
            type='text'
            placeholder='Address'
            error={errors.address?.message}
            name='address'
            control={control}
          ></Input>
          <div className='flex flex-wrap gap-6'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                value='sale'
                {...register('type')}
                id='sale'
                className='w-5'
                onChange={handleOptionChange}
                checked={selectedOption === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                value='rent'
                {...register('type')}
                id='rent'
                className='w-5'
                onChange={handleOptionChange}
                checked={selectedOption === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' {...register('parking')} id='parking' className='w-5 ' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' {...register('furnished')} id='furnished' className='w-5 ' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' {...register('offer')} id='offer' className='w-5 ' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='bedrooms'
                error={errors.bedrooms?.message}
                className='!w-20'
              ></Input>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='bathrooms'
                error={errors.bathrooms?.message}
                className='!w-20'
              ></Input>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='regularPrice'
                error={errors.regularPrice?.message}
              ></Input>
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
            {offer && (
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  control={control}
                  name='discountPrice'
                  error={errors.discountPrice?.message}
                ></Input>
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  <span className='text-xs'>($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p>
            <strong>Images:</strong> The first image will be the cover (max 6)
          </p>
          <div className='flex gap-4'>
            <input
              className='w-full p-3 border border-gray-300'
              type='file'
              id='images'
              accept='image/.*'
              multiple
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <Button
              type='button'
              onClick={handleImageSubmit}
              className='w-full bg-green-700 max-w-[84px]'
              isLoading={loadingImage}
              disabled={loadingImage}
            >
              Upload
            </Button>
          </div>
          {imageUrls.length > 0 &&
            imageUrls.map((item, index) => (
              <div key={v4()} className='flex items-center justify-between p-3 border rounded'>
                <img
                  src={item}
                  alt='Listing image'
                  className='object-contain w-20 h-20 rounded-lg'
                />
                <Button
                  onClick={() => handleRemoveImage(index)}
                  type='button'
                  className='bg-red-700'
                >
                  Delete
                </Button>
              </div>
            ))}
          <Button type='submit' isLoading={loading} disabled={loadingImage || loading}>
            Create Listing
          </Button>
        </div>
      </form>
    </main>
  );
}
