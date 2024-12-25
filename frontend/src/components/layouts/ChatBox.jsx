import PropTypes from "prop-types";
import ChatBoxContent from "@/components/layouts/ChatBoxContent";
import ChatBoxHeader from "@/components/layouts/ChatBoxHeader";
import ChatBoxFooter from "@/components/layouts/ChatBoxFooter";
import ChatPlaceholder from "@/components/layouts/ChatPlaceholder";

const ChatBox = ({
  selectedContact,
  isVisible,
  onClose,
  onProfileClick,
  userId,
}) => {
  return (
    <>
      {/* Overlay for Small Screens */}
      <div
        className={`fixed inset-0 z-10 bg-white dark:bg-[#020817] flex flex-col transform transition-transform md:hidden ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedContact ? (
          <>
            <ChatBoxHeader
              onClose={onClose}
              selectedContact={selectedContact}
              onProfileClick={onProfileClick}
            />
            {/* Pass userId to ChatBoxContent */}
            <ChatBoxContent selectedContact={selectedContact} userId={userId} />
            <ChatBoxFooter selectedContact={selectedContact} userId={userId} />
          </>
        ) : (
          <ChatPlaceholder />
        )}
      </div>

      {/* Default Layout for Medium and Larger Screens */}
      {selectedContact ? (
        <div className="hidden md:flex flex-col relative w-full">
          <ChatBoxHeader
            onClose={onClose}
            selectedContact={selectedContact}
            onProfileClick={onProfileClick}
          />
          {/* Pass userId to ChatBoxContent */}
          <ChatBoxContent selectedContact={selectedContact} userId={userId} />
          <ChatBoxFooter selectedContact={selectedContact} userId={userId} />
        </div>
      ) : (
        <ChatPlaceholder />
      )}
    </>
  );
};

ChatBox.propTypes = {
  selectedContact: PropTypes.object,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default ChatBox;
