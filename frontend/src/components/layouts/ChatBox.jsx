import PropTypes from "prop-types";
import ChatBoxContent from "@/components/layouts/ChatBoxContent";
import ChatBoxHeader from "@/components/layouts/ChatBoxHeader";
("");
import ChatBoxFooter from "@/components/layouts/ChatBoxFooter";

const ChatBox = ({ selectedContact, isVisible, onClose }) => {
  return selectedContact ? (
    <div className="hidden md:flex flex-col relative w-full">
      {/* Header */}
      <ChatBoxHeader />

      {/* Scrollable Content */}
      <ChatBoxContent />

      {/* Footer */}
      <ChatBoxFooter />
    </div>
  ) : (
    <div className="flex-grow hidden md:flex items-center justify-center w-full">
      <p className="text-gray-500">Select a contact to start chatting</p>
    </div>
  );
};

ChatBox.propTypes = {
  selectedContact: PropTypes.object, // Update type as needed
};

export default ChatBox;
