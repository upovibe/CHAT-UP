import { Link } from 'react-router-dom';
import LogoImage from '@/assets/svgs/icons/chat-up.svg'; // Ensure the path is correct

const Logo = () => {
  return (
    <>
    <Link to="/">
    <div className="flex items-center justify-center w-max">
      {/* Logo image for small screens */}
      <img
        src={LogoImage}
        alt="Logo"
        className="block size-9"
      />

      {/* Text "CHAT-UP" for larger screens */}
      <span className="hidden sm:block font-extrabold text-gray-800">CHAT-UP</span>
    </div>
    </Link>
    </>
  );
};

export default Logo;
