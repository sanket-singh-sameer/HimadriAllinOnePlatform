import React from 'react';

export const FullPageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
};



