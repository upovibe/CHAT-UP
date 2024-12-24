// import { Check, CheckCheck, Clock } from "lucide-react";
// import {useMessage} from "@/stores/useMessage"

// const ChatBoxContenet = () => {
//   const { messageSent } = useMessage();
//   return (
//     <div className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto">
//       {/* Timer */}
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
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-xs text-gray-500 flex items-center gap-1">
//             11:03 AM
//             <Clock className="size-3" />
//           </span>
//           <div className="bg-blue-600 border rounded-xl rounded-br-none text-sm flex flex-col max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] relative text-white">
//             <p className="p-2">
//               Hi, Jane, I&apos;m Looking forward to meeting You Lorem ipsum
//               dolor sit amet consectetur adipisicing elit. Cupiditate, libero
//               qui voluptates, ipsum impedit inventore sit amet nostrum maxime
//               deserunt voluptatum obcaecati dolor, magni ad aperiam molestiae
//               numquam atque nemo?
//             </p>
//             <span className="absolute right-2 bottom-2">
//               <CheckCheck className="size-4" />
//             </span>
//           </div>
//         </div>
//         {/* Recipient */}
//         <div className="flex flex-col items-start gap-1">
//           <span className="text-xs text-gray-500 flex items-center gap-1">
//             11:23 AM
//             <Clock className="size-3" />
//           </span>
//           <div className="bg-blue-50 border text-gray-900 rounded-xl rounded-bl-none text-sm items-start max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px]">
//             <p className="p-2">
//               Hi, Jane, I&apos;m Looking forward to meeting You Lorem ipsum
//               dolor sit amet consectetur adipisicing elit. Cupiditate, libero
//               qui voluptates, ipsum impedit inventore sit amet nostrum maxime
//               deserunt voluptatum obcaecati dolor, magni ad aperiam molestiae
//               numquam atque nemo?
//             </p>
//           </div>
//         </div>
//         {/* Sender */}
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-xs text-gray-600 flex items-center gap-1">
//             11:40 AM
//             <Clock className="size-3" />
//           </span>
//           <div className="bg-blue-600 text-white border rounded-xl rounded-br-none text-sm flex items-end flex-col max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] relative">
//             <img
//               src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDg0fHx1c2VyfGVufDB8fHx8MTczMjU1NjgyMHww&ixlib=rb-4.0.3&q=80&w=1080"
//               alt="sent Image"
//               className="rounded-2xl p-2"
//             />
//             <p className="p-2">
//               Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid,
//               ad. Itaque, veritatis enim totam .
//             </p>
//             <span className="absolute right-2 bottom-2">
//               <CheckCheck className="size-4" />
//             </span>
//           </div>
//         </div>
//         {/* Recipient */}
//         <div className="flex flex-col items-start gap-1">
//           <span className="text-xs text-gray-500 flex items-center gap-1">
//             11:23 AM
//             <Clock className="size-3" />
//           </span>
//           <div className="bg-blue-50 border text-gray-900 rounded-xl rounded-bl-none text-sm items-start max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px]">
//             <a
//               href="https://example.com"
//               className="text-blue-600 font-semibold underline p-2 hover:blur-none blur-sm inline-block break-words"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               click me
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBoxContenet;


import PropTypes from "prop-types";
import { CheckCheck, Clock } from "lucide-react";

const ChatBoxContenet = ({ messages }) => {
  return (
    <div className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto">
      {/* Messages */}
      <div className="flex flex-col gap-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.sender === "me" ? "items-end" : "items-start"
            } gap-1`}
          >
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              <Clock className="size-3" />
            </span>
            <div
              className={`${
                message.sender === "me"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-blue-50 text-gray-900 rounded-bl-none"
              } border rounded-xl text-sm max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[500px] p-2`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ChatBoxContenet.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
};

export default ChatBoxContenet;
