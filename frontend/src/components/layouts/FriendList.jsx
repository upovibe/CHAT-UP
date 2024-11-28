import PropTypes from "prop-types";

const FriendList = ({ isSidebarExpanded, onProfileClick }) => {
  return (
    <div
      className={`bg-white border-r-2 p-4 transition-all duration-300 ${
        isSidebarExpanded ? "w-full sm:w-full" : "w-fit xl:w-3/12"
      }`}
    >
      <h2 className="text-sm md:text-lg font-bold">Friend</h2>
      <ul className="space-y-4">
        <li onClick={onProfileClick} className="cursor-pointer">
          Friend 1
        </li>
        <li onClick={onProfileClick} className="cursor-pointer">
          Friend 2
        </li>
        <li onClick={onProfileClick} className="cursor-pointer">
          Friend 3
        </li>
      </ul>
    </div>
  );
};

FriendList.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default FriendList;
