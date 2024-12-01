import PropTypes from "prop-types";
import ChatBoxContent from "@/components/layouts/ChatBoxContent";
import ChatBoxHeader from "@/components/layouts/ChatBoxHeader";
import ChatBoxFooter from "@/components/layouts/ChatBoxFooter";

const ChatBox = ({ selectedContact, isVisible, onClose, onProfileClick }) => {
  return (
    <>
      {/* Overlay for Small Screens */}
      <div
        className={`fixed inset-0 z-10 bg-white flex flex-col transform transition-transform md:hidden ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedContact ? (
          <>
            {/* Header */}
            <ChatBoxHeader onClose={onClose} />

            {/* Scrollable Content */}
            <ChatBoxContent />

            {/* Footer */}
            <ChatBoxFooter />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}
      </div>

      {/* Default Layout for Medium and Larger Screens */}
      {selectedContact ? (
        <div className="hidden md:flex flex-col relative w-full">
          {/* Header */}
          <ChatBoxHeader onClose={onClose} onProfileClick={onProfileClick} />

          {/* Scrollable Content */}
          <ChatBoxContent />

          {/* Footer */}
          <ChatBoxFooter />
        </div>
      ) : (
        <div className="flex-grow hidden md:flex items-center justify-center w-full">
          <p className="text-gray-500">Select a contact to start chatting</p>
        </div>
      )}
    </>
  );
};

ChatBox.propTypes = {
  selectedContact: PropTypes.object,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default ChatBox;
