import PropTypes from 'prop-types';

export default function Button({
  children,
  isLoading = false,
  type = 'button',
  className = 'bg-slate-700',
  disabled = false,
  onClick = () => {},
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex items-center justify-center p-3 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className='border-4 rounded-full h-7 w-7 border-t-transparent border-b-transparent animate-spin' />
      ) : (
        children
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
