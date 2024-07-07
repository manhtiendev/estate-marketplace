import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold text-gray-800'>404</h1>
      <p className='text-xl text-gray-600'>Page Not Found</p>
      <h1 className='mt-4 text-4xl font-bold text-blue-500'>OOPS!...</h1>
      <Link to='/'>
        <button className='px-4 py-2 mt-8 font-bold text-white rounded bg-slate-500 hover:bg-slate-600'>
          Go Back
        </button>
      </Link>
    </div>
  );
}
