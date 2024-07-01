import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';

export default function Input({
  control,
  name,
  type = 'text',
  error = '',
  placeholder = '',
  children,
  ...rest
}) {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  });
  return (
    <div className='relative'>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className='w-full p-3 border rounded-lg'
        {...field}
        {...rest}
      />
      {error.length > 0 && (
        <span className='absolute text-sm font-medium text-red-500 pointer-events-none top-[60px] -translate-y-2/4 left-4 error-input'>
          {error}
        </span>
      )}
      {children && (
        <span className='absolute cursor-pointer select-none right-6 top-2/4 -translate-y-2/4'>
          {children}
        </span>
      )}
    </div>
  );
}

Input.propTypes = {
  control: PropTypes.any.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
};
