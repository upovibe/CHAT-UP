import PropTypes from "prop-types";
import { SidebarClose } from "lucide-react";
import ProfileInfo from "@/components/layouts/ProfileInfo";

const AuthorProfileInfo = ({ isVisible, onClose }) => {
  return (
    <>
      {/* Overlay - On Small/Medium screens */}
      <div
        className={`fixed top-0 right-0 w-full md:w-6/12 h-full border-l-2 z-[9999] transform transition-transform duration-300 ease-out 
      ${
        isVisible
          ? "translate-x-0 animate-slideIn bg-white"
          : "translate-x-full animate-slideOut bg-white"
      }
      sm:block md:block lg:hidden`}
      >
        {/* Close Button for Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 border-gray-300 border-2 text-gray-400 rounded-full p-2"
        >
          <SidebarClose className="size-3" />
        </button>
        {/* Pass onClose here */}
        <ProfileInfo onClose={onClose} />
      </div>

      {/* On Large screens, display as part of the layout */}
      <div
        className={`fixed top-0 right-0 lg:static lg:translate-x-0 transition-all duration-300 ease-in-out ${
          isVisible ? "block" : "hidden"
        } lg:w-6/12 xl:w-8/12 border-l-2`}
      >
        {/* ProfileInfo Component */}
        <ProfileInfo onClose={onClose} />
      </div>
    </>
  );
};

AuthorProfileInfo.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default AuthorProfileInfo;
