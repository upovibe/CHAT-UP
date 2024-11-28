import PropTypes from "prop-types";
import { SidebarClose, SidebarOpen } from "lucide-react";

const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
  return (
    <div
      className={`transition-all duration-300 p-0 border-r-2 ${
        isSidebarExpanded ? "w-fit" : "w-0 lg:w-2/12 xl:w-2/12"
      }`}
    >
      <h2
        className={`text-sm md:text-lg font-bold p-4 ${
          isSidebarExpanded ? "block" : "hidden md:block"
        }`}
      >
        Sidebar
      </h2>
      <div
        className={`flex flex-col ${
          isSidebarExpanded ? "block" : "hidden md:block"
        }`}
      >
        {/* Navigation Options */}
        <ul className="space-y-4">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>

      {/* Toggle Button for Sidebar (Visible only on small screens) */}
      <button
        onClick={toggleSidebar}
        className="absolute bottom-0 left-0 z-30 p-1 m-2 border-gray-300 border-2 text-gray-400 rounded-full lg:hidden"
      >
        {isSidebarExpanded ? (
          <SidebarClose className="size-4" />
        ) : (
          <SidebarOpen className="size-4" />
        )}
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
