import PropTypes from "prop-types";
import { SidebarClose } from "lucide-react";

const RecipientInfo = ({ isVisible, onClose }) => {
  return (
    <>
      {/* Overlay - On Small/Medium screens */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/3 h-full border-l-2 p-4 z-40 transform transition-transform duration-300 ease-out 
          ${isVisible ? "translate-x-0 animate-slideIn bg-white" : "translate-x-full animate-slideOut bg-white"}
          sm:block md:block lg:hidden`}
      >
        {/* Close Button for Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 border-gray-300 border-2 text-gray-400 rounded-full p-2"
        >
          <SidebarClose className="size-3"/>
        </button>
        <h2 className="text-sm md:text-lg font-bold">Recipient Info</h2>
        <p className="mt-2">Details about the recipient</p>
      </div>

      {/* On Large screens, display as part of the layout */}
      <div
        className={`${
          isVisible ? "block" : "hidden"
        } w-4/12 md:w-3/12 border-l-2 p-4 lg:block sm:hidden md:hidden transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-sm md:text-lg font-bold">Recipient Info</h2>
        <p className="mt-2">Details about the recipient</p>
      </div>
    </>
  );
};

RecipientInfo.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RecipientInfo;
