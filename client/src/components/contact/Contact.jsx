import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../button';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`http://localhost:3000/v1/users/${listing.userRef}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        setLandlord(data.user);
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch landlord data');
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4'>
          <p>
            Contact <strong>{landlord.username}</strong> for <strong>{listing.name}</strong>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={handleMessage}
            placeholder='Enter your message here...'
            className='w-full p-4 rounded outline-none resize-none'
          ></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
            <Button type='button'>Send Message</Button>
          </Link>
        </div>
      )}
    </>
  );
}

Contact.propTypes = {
  listing: PropTypes.object,
};
