import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

const LIST_LINK = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'About',
    url: 'about',
  },
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className='shadow-md bg-slate-200 '>
      <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
        <Link to='/'>
          <h1 className='flex flex-wrap text-sm font-bold sm:text-xl'>
            <span className='text-slate-500'>MTDev</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form className='flex items-center p-2 rounded-lg bg-slate-100'>
          <input
            type='text'
            name='search'
            className='w-24 bg-transparent sm:w-64'
            placeholder='Search...'
            id='search'
          />
          <FaSearch className='ml-4 text-slate-500'></FaSearch>
        </form>
        <ul className='flex gap-4 '>
          {LIST_LINK &&
            LIST_LINK.map((item) => (
              <Link to={item.url} key={v4()}>
                <li className='hidden sm:inline text-slate-700 hover:underline'>{item.title}</li>
              </Link>
            ))}{' '}
          <Link to='/profile'>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt='avatar'
                className='object-cover rounded-full w-7 h-7'
              />
            ) : (
              <li className='hidden sm:inline text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
