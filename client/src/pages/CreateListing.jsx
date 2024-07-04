import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/input';
import * as yup from 'yup';
import { Textarea } from '~/components/textarea';
import { Button } from '~/components/button';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('This field is required')
    .min(10, 'Name must be greater than 10 characters')
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
    .required('This field is required')
    .min(1, 'Listing discount price must be greater or equal then 1'),
});

export default function CreateListing() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const handleCreateListing = (values) => {
    console.log(values);
  };

  return (
    <main className='max-w-4xl p-3 mx-auto'>
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
              <input type='checkbox' {...register('sale')} id='sale' className='w-5 ' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' {...register('rent')} id='rent' className='w-5 ' />
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
                className='w-20'
              ></Input>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='bathrooms'
                error={errors.bathrooms?.message}
                className='w-20'
              ></Input>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='regularPrice'
                error={errors.regularPrice?.message}
                className='w-20'
              ></Input>
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                control={control}
                name='discountPrice'
                error={errors.discountPrice?.message}
                className='w-20'
              ></Input>
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
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
            />
            <button className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>
              Upload
            </button>
          </div>
          <Button type='submit'>Create Listing</Button>
        </div>
      </form>
    </main>
  );
}
