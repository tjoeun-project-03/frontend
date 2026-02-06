import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full
        bg-blue-600
        text-white
        font-bold
        py-3 px-4
        rounded-lg
        hover:bg-blue-700
        transition duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;