import React from 'react';

const DeleteButtonWithTooltip = ({showTooltip,setShowTooltip,handleButtonClick}) => {


  return (
    <div className="absolute bottom-full">
  
      {showTooltip && (
        <div className=" mb-2 w-max p-2 text-white bg-gray-800 rounded shadow-lg">
          Are you sure you want to delete?
        </div>
      )}

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={handleButtonClick}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteButtonWithTooltip;
