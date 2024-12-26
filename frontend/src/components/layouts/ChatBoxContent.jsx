// import PropTypes from "prop-types";
// import { Check, CheckCheck, Clock } from "lucide-react";
// import { useChatMessages } from "@/stores/useChatMessages";

// const ChatBoxContent = ({ selectedContact, userId }) => {
//   // const reciever = selectedContact?.id;

//   console.log("User ID", userId);
//   console.log("Recipient ID", selectedContact?.id);

//   return (
//     <div className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto">
//       {/* Timer  Ensure its based on the day if within the week and date as it dat and month if months of clast chat*/}
//       <div className="flex items-center text-gray-400">
//         <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
//         <span className="px-3 py-1 text-xs border font-semibold rounded-full uppercase">
//           Monday
//         </span>
//         <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
//       </div>

//       {/* Chats */}
//       <div className="flex flex-col gap-5">
//         {/* Sender */}
//         <div className="bg-blue-600 border rounded-xl rounded-br-none text-sm flex flex-col max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] relative text-white p-2 ml-auto">
//           <p>Hi, Jane, how are you? Lorem ipsum dolor sit amet consectetur</p>
//           <div className="flex items-center gap-1 w-fit ml-auto">
//             <span className="text-xs text-gray-200 flex items-center gap-1">
//               11:03 AM
//               <Clock className="size-3" />
//             </span>
//             <CheckCheck className="size-4" /> {/* If read */}
//           </div>
//         </div>
//         {/* Recipient */}
//         <div className="bg-blue-50 border text-gray-900 rounded-xl rounded-bl-none text-sm items-start max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] p-2 mr-auto">
//           <p>Yeah Brown, I am doing great I know its really been a while</p>
//           <div className="flex items-center gap-1 w-fit ml-auto">
//             <span className="text-xs text-gray-800 flex items-center gap-1">
//               11:10 AM
//               <Clock className="size-3" />
//             </span>
//           </div>
//         </div>
//         {/* Sender */}
//         <div className="bg-blue-600 text-white border rounded-xl rounded-br-none text-sm flex items-end flex-col max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] relative ml-auto p-2">
//           <img
//             src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDg0fHx1c2VyfGVufDB8fHx8MTczMjU1NjgyMHww&ixlib=rb-4.0.3&q=80&w=1080"
//             alt="sent Image"
//             className="rounded-lg mb-2"
//           />
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid,
//             ad. Itaque, veritatis enim totam .
//           </p>
//           <div className="flex items-center gap-1 w-fit ml-auto">
//             <span className="text-xs text-gray-200 flex items-center gap-1">
//               11:03 AM
//               <Clock className="size-3" />
//             </span>
//             <CheckCheck className="size-4" /> {/* If read */}
//           </div>
//         </div>
//         {/* Recipient */}
//         <div className="bg-blue-50 border text-gray-900 rounded-xl rounded-bl-none text-sm items-start max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] p-2 mr-auto">
//           <a
//             href="https://example.com"
//             className="text-blue-600 font-semibold underline p-2 hover:blur-none blur-sm inline-block break-words"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             click me
//           </a>
//           <div className="flex items-center gap-1 w-fit ml-auto">
//             <span className="text-xs text-gray-800 flex items-center gap-1">
//               11:10 AM
//               <Clock className="size-3" />
//             </span>
//           </div>
//         </div>
//                 {/* Sender */}
//                 <div className="bg-blue-600 border rounded-xl rounded-br-none text-sm flex flex-col max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] relative text-white p-2 ml-auto">
//           <p>
//             Hi, Jane, I&apos;m Looking forward to meeting You Lorem ipsum dolor
//             sit amet consectetur
//           </p>
//           <div className="flex items-center gap-1 w-fit ml-auto">
//             <span className="text-xs text-gray-200 flex items-center gap-1">
//               11:56 AM
//               <Clock className="size-3" />
//             </span>
//             <Check className="size-4" /> {/* If sent but not read */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// ChatBoxContent.propTypes = {
//   selectedContact: PropTypes.object,
//   userId: PropTypes.string,
// };

// export default ChatBoxContent;

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Check, CheckCheck, ChevronDown, Clock } from "lucide-react";
import { useChatMessages } from "@/stores/useChatMessages";
import {
  isNewDay,
  formatDateSeparator,
  formatMessageTime,
} from "@/utils/dataFormat";

const ANIMATION_DURATION = 200;

const ChatBoxContent = ({ selectedContact, userId }) => {
  const { chatMessages, isLoading, fetchChatMessages } = useChatMessages();
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
      const clientHeight = chatContainerRef.current.clientHeight;

      const animateScroll = () => {
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;

          const progress = (timestamp - startTime) / ANIMATION_DURATION;
          const newScrollTop =
            scrollTop + (scrollHeight - clientHeight - scrollTop) * progress;

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = newScrollTop;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setIsScrolledUp(false);
          }
        };

        requestAnimationFrame(step);
      };

      requestAnimationFrame(animateScroll);
    }
  };

  console.log("Sender ID", userId);
  console.log("Receiver ID", selectedContact?.id);

  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto"
    >
      {/* Scroll to bottom button */}
      {isScrolledUp && (
        <button
          className="fixed bottom-40 right-5 bg-[#020817]/50 text-white p-2 rounded-full shadow-lg"
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
            // Check if a date separator is needed
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

                <div
                  className={`flex flex-col w-fit max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] p-2 ${
                    message.senderId === userId
                      ? "ml-auto bg-blue-600 text-white border rounded-xl rounded-br-none"
                      : "mr-auto bg-blue-50 border text-gray-900 rounded-xl rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.attachment && (
                    <img
                      src={message.attachment}
                      alt="Attachment"
                      className="rounded-lg mb-2"
                    />
                  )}
                  <div className="flex items-center gap-1 w-fit ml-auto">
                    <span
                      className={`text-xs ${
                        message.senderId === userId
                          ? "text-gray-200"
                          : "text-gray-800"
                      } flex items-center gap-1`}
                    >
                      {formatMessageTime(message.createdAt)}
                      <Clock className="size-3" />
                    </span>
                    {message.senderId === userId && message.read ? (
                      <CheckCheck size={15} /> /* If read */
                    ) : (
                      <Check size={15} /> /* If sent but not read */
                    )}
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
