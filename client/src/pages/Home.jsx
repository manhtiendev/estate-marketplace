import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { v4 } from 'uuid';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from '~/components/common/ListingItem';

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/v1/listing?offer=true&limit=4', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setOfferListings(data.listings);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/v1/listing?type=rent&limit=4', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setRentListings(data.listings);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/v1/listing?type=sale&limit=4', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setSaleListings(data.listings);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className='flex flex-col max-w-6xl gap-6 px-3 mx-auto py-28'>
        <h1 className='text-3xl font-bold text-slate-700 lg:text-6xl '>
          Find your next <span className='text-slate-500'>perfect</span> <br /> place with ease
        </h1>
        <div className='text-xs text-gray-400 sm:text-sm'>
          MTDev Estate will help you find your home fast, easy and comfortable. <br />
          Our expert support are always available.
        </div>
        <Link className='text-xs font-bold text-blue-600 sm:text-sm hover:underline' to='/search'>
          Let's Start now...
        </Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={v4()}>
              <div
                className='h-[500px]'
                style={{
                  background: `url(${listing.imageUrls[0]}) center/cover no-repeat`,
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing result for offer, sale & rent */}
      <div className='flex flex-col max-w-6xl gap-8 p-3 mx-auto my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-500 hover:underline' to='/search?offer=true'>
                Show more offers...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 xl:grid xl:grid-cols-4'>
              {offerListings.map((listing) => (
                <ListingItem key={v4()} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-500 hover:underline' to='/search?type=rent'>
                Show more offers...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 xl:grid xl:grid-cols-4'>
              {rentListings.map((listing) => (
                <ListingItem key={v4()} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-500 hover:underline' to='/search?type=sale'>
                Show more offers...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 xl:grid xl:grid-cols-4'>
              {saleListings.map((listing) => (
                <ListingItem key={v4()} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
