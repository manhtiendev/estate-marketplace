import { toast } from 'react-toastify';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '~/config/firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '~/redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch('http://localhost:3000/v1/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data.user));
      toast.success('Login successfully');
      navigate('/');
    } catch (error) {
      console.log('🚀 ~ handleGoogleClick ~ error:', error);
      toast.error('Could not sign in with Google');
    }
  };
  return (
    <button
      type='button'
      className='p-3 text-white uppercase bg-red-700 rounded-lg hover:opacity-95 disabled:opacity-50'
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
}
