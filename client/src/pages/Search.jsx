import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/components/button';
import ListingItem from '~/components/common/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchParams = urlParams.toString();
      try {
        const res = await fetch(`http://localhost:3000/v1/listing?${searchParams}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success === false) {
          toast.error('Get listing failed');
          setLoading(false);
          return;
        }
        setListings(data.listings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error('Something went wrong!');
      }
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({
        ...sidebarData,
        type: e.target.id,
      });
    }
    if (e.target.id === 'searchTerm') {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }
    if (e.target.id === 'sort_order') {
      //   console.log(e);
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({
        ...sidebarData,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`?${searchQuery}`);
  };

  return (
    <div className='flex flex-col mx-auto max-w-7xl md:flex-row'>
      <div className='border-b-2 p-7 md:border-r-2 md:min-h-screen max-w-[400px]'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8 '>
          <div className='flex items-center gap-2'>
            <label htmlFor='searchTerm' className='font-semibold cursor-pointer whitespace-nowrap'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='w-full p-3 border rounded-lg'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <label className='font-semibold'>Type</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='sort_order' className='font-semibold'>
              Sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue='createdAt_desc'
              id='sort_order'
              className='p-2 border rounded-lg'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <Button disabled={loading} type='submit'>
            Search
          </Button>
        </form>
      </div>
      <div className=''>
        <h1 className='p-3 mt-4 text-3xl font-semibold border-b text-slate-700'>
          Listing results:
        </h1>
        <div className='flex flex-wrap gap-4 xl:grid xl:grid-cols-3 xl:gap-4 p-7'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700 '>No listing found!</p>
          )}
          {loading && (
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 border-4 rounded-full border-t-transparent animate-spin border-slate-700'></div>
              <p className='text-slate-700'>Loading...</p>
            </div>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
        </div>
      </div>
    </div>
  );
}
