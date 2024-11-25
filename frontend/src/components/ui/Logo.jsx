import React from 'react';
import LogoImage from '@/assets/svgs/icons/chat-up.svg'; // Ensure the path is correct

const Logo = () => {
  return (
    <div className="flex items-center justify-center w-max">
      {/* Logo image for small screens */}
      <img
        src={LogoImage}
        alt="Logo"
        className="block size-10"
      />

      {/* Text "CHAT-UP" for larger screens */}
      <span className="hidden sm:block text-2xl font-bold text-black/70">CHAT-UP</span>
    </div>
  );
};

export default Logo;
