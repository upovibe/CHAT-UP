import { Check, CheckCheck, Clock } from "lucide-react";

const ChatContent = () => {
  return (
    <div className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto">
      {/* Timer */}
      <div className="flex items-center text-gray-400">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-3 py-1 text-xs border font-semibold rounded-full uppercase">
          Monday
        </span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Chats */}
      <div className="flex flex-col gap-5">
        {/* Sender */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            11:03 AM
            <Clock className="size-3" />
          </span>
          <div className="bg-[#e5f0ff] border border-gray-200 shadow rounded-xl rounded-br-none text-sm flex flex-col max-w-[400px] md:max-w-[500px] relative">
            <p className="p-2">
              Hi, Jane, I&apos;m Looking forward to meeting You Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Cupiditate, libero
              qui voluptates, ipsum impedit inventore sit amet nostrum maxime
              deserunt voluptatum obcaecati dolor, magni ad aperiam molestiae
              numquam atque nemo?
            </p>
            <span className="absolute right-2 bottom-2">
              <CheckCheck className="size-4" />
            </span>
          </div>
        </div>
        {/* Recipient */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            11:23 AM
            <Clock className="size-3" />
          </span>
          <div className="bg-[#fafafb] border border-gray-200 shadow text-gray-900 rounded-xl rounded-bl-none text-sm items-start max-w-[400px] md:max-w-[500px]">
            <p className="p-2">
              Hi, Jane, I&apos;m Looking forward to meeting You Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Cupiditate, libero
              qui voluptates, ipsum impedit inventore sit amet nostrum maxime
              deserunt voluptatum obcaecati dolor, magni ad aperiam molestiae
              numquam atque nemo?
            </p>
          </div>
        </div>
        {/* Sender */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            11:40 AM
            <Clock className="size-3" />
          </span>
          <div className="bg-[#e5f0ff] border shadow border-gray-200 rounded-xl rounded-br-none text-sm flex items-end flex-col max-w-[400px] md:max-w-[500px] relative">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDg0fHx1c2VyfGVufDB8fHx8MTczMjU1NjgyMHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="sent Image"
              className="rounded-2xl p-2"
            />
            <p className="p-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid,
              ad. Itaque, veritatis enim totam .
            </p>
            <span className="absolute right-2 bottom-2">
              <CheckCheck className="size-4" />
            </span>
          </div>
        </div>
        {/* Recipient */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            11:23 AM
            <Clock className="size-3" />
          </span>
          <div className="bg-[#fafafb] border border-gray-200 shadow rounded-xl rounded-bl-none text-sm items-start max-w-[400px] md:max-w-[500px]">
            <a
              href="https://example.com"
              className="text-blue-600 font-semibold underline p-2 hover:blur-none blur-sm inline-block break-words"
              target="_blank"
              rel="noopener noreferrer"
            >
              click me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;
