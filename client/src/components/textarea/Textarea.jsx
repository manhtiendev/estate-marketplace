import { useController } from 'react-hook-form';
import Proptypes from 'prop-types';

const Textarea = ({
  control,
  name = '',
  error = '',
  placeholder = '',
  className = '',
  errorClassName = '',
  ...rest
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  });
  return (
    <div className='relative'>
      <textarea
        placeholder={placeholder}
        className={`p-3 border w-full outline-none resize-none rounded-lg ${className}`}
        id={name}
        {...field}
        {...rest}
      />
      {error.length > 0 && (
        <span
          className={`absolute top-[84px] left-4 text-sm font-medium text-red-500 pointer-events-none -translate-y-2/4 error-input ${errorClassName}`}
        >
          {error}
        </span>
      )}
    </div>
  );
};

Textarea.propTypes = {
  control: Proptypes.any.isRequired,
  name: Proptypes.string,
  placeholder: Proptypes.string,
  className: Proptypes.string,
  error: Proptypes.string,
  errorClassName: Proptypes.string,
};

export default Textarea;
