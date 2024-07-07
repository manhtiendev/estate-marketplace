import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='overflow-hidden transition-shadow bg-white rounded-lg w-full sm:w-[250px] shadow-md hover:shadow-lg'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          className='object-cover w-full h-[320px] sm:h-[150px] hover:scale-105 transition-scale duration-300'
          alt='listing-cover'
        />
        <div className='flex flex-col w-full gap-2 p-3'>
          <p className='mt-4 text-lg font-semibold truncate text-slate-700'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='w-4 h-4 text-green-700' />
            <p className='w-full text-sm text-gray-600 truncate'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <p className='mt-2 font-semibold text-slate-500'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='flex gap-4 text-slate-700'>
            <div className='flex items-center gap-1 text-xs font-bold'>
              <FaBed />
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className='flex items-center gap-1 text-xs font-bold'>
              <FaBath />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.object,
};
