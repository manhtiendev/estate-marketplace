import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const { id } = params;
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/v1/listing/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const { data } = await res.json();
        if (data.success === false) {
          toast.error('Something went wrong!');
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
        setLoading(false);
      }
    };
    fetchListing();
  }, [params]);
  return (
    <main>
      {loading && (
        <div className='flex items-center justify-center h-screen gap-4 -translate-y-20'>
          <div className='w-10 h-10 border-4 border-gray-600 rounded-full border-t-transparent border-b-transparent animate-spin'></div>
          <p className='text-2xl'>Loading...</p>
        </div>
      )}
      {listing && listing.imageUrls && !loading && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((img) => (
              <SwiperSlide key={img}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${img}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}
