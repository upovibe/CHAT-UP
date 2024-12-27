import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Check, CheckCheck, ChevronDown, Clock, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatMessages } from "@/stores/useChatMessages";
import {
  isNewDay,
  formatDateSeparator,
  formatMessageTime,
} from "@/utils/dataFormat";

const ChatBoxContent = ({ selectedContact, userId }) => {
  const {
    chatMessages,
    isLoading,
    fetchChatMessages,
    subscribeToChatMessages,
    unsubscribeFromChatMessages,
  } = useChatMessages();
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const chatContainerRef = useRef(null);
  const scrollButtonRef = useRef(null);

  const receiver = selectedContact?.id;

  // Fetch chat messages when the component mounts or when the selected contact changes
  useEffect(() => {
    const fetchMessages = async () => {
      await fetchChatMessages(receiver);
    };
    fetchMessages();
  }, [selectedContact, fetchChatMessages, receiver]);

  useEffect(() => {
    subscribeToChatMessages(userId);
  
    return () => {
      unsubscribeFromChatMessages();
    };
  }, [userId, subscribeToChatMessages, unsubscribeFromChatMessages]);

  // Scroll to the bottom when new messages are loaded
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 200); // Delay ensures DOM updates
    }
  }, [chatMessages]);

  // Handle scroll events
  const handleScroll = () => {
    const scrollTop = chatContainerRef.current.scrollTop;
    const scrollHeight = chatContainerRef.current.scrollHeight;
    const clientHeight = chatContainerRef.current.clientHeight;

    if (scrollTop + clientHeight === scrollHeight) {
      setIsScrolledUp(false);
    } else {
      setIsScrolledUp(true);
    }
  };

// Smooth scroll to the bottom
const scrollToBottom = () => {
  if (chatContainerRef.current) {
    const scrollHeight = chatContainerRef.current.scrollHeight;
    const scrollTop = chatContainerRef.current.scrollTop;
    const distance = scrollHeight - scrollTop - chatContainerRef.current.clientHeight;

    const duration = 300; // Animation duration in milliseconds
    let startTime;

    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
      const easedProgress = easeInOutQuad(progress);

      chatContainerRef.current.scrollTop = scrollTop + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsScrolledUp(false);
      }
    };

    requestAnimationFrame(step);
  }
};


  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto"
    >
      {/* Scroll to bottom button */}
      {isScrolledUp && (
        <button
          className="fixed z-50 bottom-40 right-5 bg-[#020817]/50 text-white p-2 rounded-full shadow-lg"
          onClick={scrollToBottom}
          ref={scrollButtonRef}
        >
          <ChevronDown />
        </button>
      )}

      {/* Chats */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-5">
          {chatMessages.map((message, index) => {
            const showDateSeparator =
              index === 0 ||
              isNewDay(
                message.createdAt,
                chatMessages[index - 1]?.createdAt || message.createdAt
              );

            return (
              <div key={message._id}>
                {showDateSeparator && (
                  <div className="flex items-center text-gray-400 mb-4 opacity-60 transition-opacity duration-300">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="px-3 py-1 text-xs border font-semibold rounded-full uppercase">
                      {formatDateSeparator(
                        message.createdAt,
                        chatMessages[index - 1]?.createdAt
                      )}
                    </span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                )}
                <div className="relative flex">
                  {message.senderId !== userId && (
                    <Avatar className="mr-2 mt-auto size-8">
                      <AvatarImage src={selectedContact?.avatar} />
                      <AvatarFallback>
                        {selectedContact?.name
                          ? selectedContact.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex-col w-fit max-w-[250px] sm:max-w-[300px] md:max-w-[350px]                     lg:max-w-[500px] p-2 ${
                      message.senderId === userId
                        ? "ml-auto bg-blue-600 text-white border rounded-2xl rounded-br-none relative"
                        : "mr-auto bg-gray-300 border text-gray-900 rounded-2xl rounded-bl-none relative"
                    }`}
                  >
                    {message.senderId === userId && (
                      <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 rotate-45 border-[5px] border-blue-600 border-b-transparent border-r-transparent"></div>
                    )}
                    {message.senderId !== userId && (
                      <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 border-[5px] border-gray-300 border-b-transparent border-r-transparent"></div>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-lg mb-2"
                      />
                    )}

                    <p className="break-all">{message.text}</p>
                    <div className="flex items-center gap-1 w-fit ml-auto">
                      <span
                        className={`text-xs ${
                          message.senderId === userId
                            ? "text-gray-200"
                            : "text-gray-800"
                        } flex items-center gap-1`}
                      >
                        {message.createdAt ? (
                          <>
                            {formatMessageTime(message.createdAt)}
                            <Clock className="size-3" />
                          </>
                        ) : (
                          <Loader className="animate-spin size-3" />
                        )}
                      </span>
                      {message.senderId === userId && (
                        <div>
                          {message.read ? (
                            <CheckCheck size={15} />
                          ) : (
                            <Check size={15} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

ChatBoxContent.propTypes = {
  selectedContact: PropTypes.object,
  userId: PropTypes.string,
};

export default ChatBoxContent;
