import PropTypes from "prop-types";
import { SidebarClose } from "lucide-react";
import ProfileInfo from "./ProfileInfo";

const AuthorProfileInfo = ({ isVisible, onClose }) => {
  return (
    <>
      {/* Overlay - On Small/Medium screens */}
      <div
        className={`fixed top-0 right-0 w-full md:w-6/12 h-full border-l-2 z-40 transform transition-transform duration-300 ease-out 
          ${isVisible ? "translate-x-0 animate-slideIn bg-white" : "translate-x-full animate-slideOut bg-white"}
          sm:block md:block lg:hidden`}
      >
        {/* Close Button for Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 border-gray-300 border-2 text-gray-400 rounded-full p-2"
        >
          <SidebarClose className="size-3" />
        </button>
        <ProfileInfo />
      </div>

      {/* On Large screens, display as part of the layout */}
      <div
        className={`${
          isVisible ? "block" : "hidden"
        } w-4/12 border-l-2 lg:block sm:hidden md:hidden transition-all duration-300 ease-in-out`}
      >
        {/* Reusing ProfileInfo Component */}
        <ProfileInfo />
      </div>
    </>
  );
};

AuthorProfileInfo.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthorProfileInfo;