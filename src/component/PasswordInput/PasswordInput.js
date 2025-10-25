import React, { useState } from 'react';

const PasswordInput = ({ inputChange, fieldData, errorData }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* <label className="mb-2 font-medium text-gray-700">Password *</label> */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={inputChange}
          value={fieldData}
          placeholder="Password"
        />
        {errorData && <p className="text-red-500 text-sm mt-1">{errorData}</p>}

        {/* Eye icon for toggling password visibility */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            // Eye icon when the password is visible
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3C5.5 3 2 7.5 2 10s3.5 7 8 7 8-4.5 8-7-3.5-7-8-7zm0 12c-3.3 0-6-2.7-6-5s2.7-5 6-5 6 2.7 6 5-2.7 5-6 5zm-1-5a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm1-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          ) : (
            // Eye-off icon when the password is hidden
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3C5.5 3 2 7.5 2 10s3.5 7 8 7 8-4.5 8-7-3.5-7-8-7zm0 12c-3.3 0-6-2.7-6-5s2.7-5 6-5 6 2.7 6 5-2.7 5-6 5zm1-5a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-4.293 1.293l6 6a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 1.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
