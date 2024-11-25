import React from 'react';

const Divider = ({ text = "OR", className = "" }) => {
  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <div className="flex-1 h-px bg-gray-950"></div>
      {text && <span className="px-2 text-sm text-gray-800">{text}</span>}
      <div className="flex-1 h-px bg-gray-950"></div>
    </div>
  );
};

export default Divider;
