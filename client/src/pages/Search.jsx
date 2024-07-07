import { Button } from '~/components/button';

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='border-b-2 p-7 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8 '>
          <div className='flex items-center gap-2'>
            <label htmlFor='searchTerm' className='font-semibold cursor-pointer whitespace-nowrap'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='w-full p-3 border rounded-lg'
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <label className='font-semibold'>Type</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all' />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='sort_order' className='font-semibold'>
              Sort:
            </label>
            <select id='sort_order' className='p-2 border rounded-lg'>
              <option value=''>Price high to low</option>
              <option value=''>Price low to high</option>
              <option value=''>Latest</option>
              <option value=''>Oldest</option>
            </select>
          </div>
          <Button type='submit'>Search</Button>
        </form>
      </div>
      <div className=''>
        <h1 className='p-3 mt-4 text-3xl font-semibold border-b text-slate-700'>
          Listing results:
        </h1>
      </div>
    </div>
  );
}
