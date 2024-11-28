import PropTypes from "prop-types";

const ChatBox = ({ isSidebarExpanded }) => {
  return (
    <>
      {!isSidebarExpanded && (
        <div className="flex-grow p-4">
          ChatBox
        </div>
      )}
    </>
  );
};

ChatBox.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
};

export default ChatBox;
