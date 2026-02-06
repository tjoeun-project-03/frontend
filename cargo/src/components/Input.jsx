import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          px-3 py-3
          border border-gray-300
          rounded-lg
          focus:outline-none
          focus:border-blue-500
          focus:ring-1 focus:ring-blue-500
        "
      />
    </div>
  );
};

export default Input;