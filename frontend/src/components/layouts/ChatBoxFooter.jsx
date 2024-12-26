// import { useState } from "react";
// import PropTypes from "prop-types";
// import { Button } from "@/components/ui/button";
// import { FileText, Images, Link, SendHorizonal, Smile } from "lucide-react";
// import { InputTextarea } from "@/components/ui/InputTextarea";
// import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";

// const ChatBoxFooter = ({ selectedContact, userId }) => {
//   const [inputValue, setInputValue] = useState("");

//   // const recieverId = selectedContact?.id;

//   console.log("User ID", userId);
//   console.log("Recipient ID", selectedContact?.id);

//   const triggerElement = <Link className="rounded-full size-6 p-1" />;

//   const menuItems = [
//     {
//       label: "Photos & Videos",
//       icon: <Images color="#007bfc" />,
//     },
//     {
//       label: "Documents",
//       icon: <FileText color={"#7f66ff"} />,
//     },
//   ];

//   return (
//     <div className="w-full p-4 border-t-2">
//       <div className="rounded-xl border-gray-300 flex flex-col gap-2">
//         <InputTextarea
//           placeholder="Type a message..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-1">
//             <Button
//               className="size-8 border-none rounded-full"
//               variant="outline"
//             >
//               <Smile />
//             </Button>

//             {/* DropdownMenuWrapper without nested buttons */}
//             <DropdownMenuWrapper
//               triggerElement={triggerElement}
//               menuItems={menuItems}
//               className="left-0"
//             />
//           </div>
//           <Button
//             type="submit"
//             variant="outline"
//             className="rounded-full h-9 flex"
//           >
//             <span className="hidden lg:block">Send</span>
//             <SendHorizonal />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// ChatBoxFooter.propTypes = {
//   selectedContact: PropTypes.object,
//   userId: PropTypes.string,
// };

// export default ChatBoxFooter;

// import { useState } from "react";
// import PropTypes from "prop-types";
// import { Button } from "@/components/ui/button";
// import { FileText, Images, Link, SendHorizonal, Smile } from "lucide-react";
// import { InputTextarea } from "@/components/ui/InputTextarea";
// import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
// import { useChatMessages } from "@/stores/useChatMessages";

// const ChatBoxFooter = ({ selectedContact, userId }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [attachments, setAttachments] = useState([]); // Placeholder for attachments if needed
//   const { sendChatMessage, isLoading } = useChatMessages();

//   const handleSendChatMessage = async () => {
//     if (!inputValue.trim()) {
//       console.error("Message content is empty");
//       return;
//     }

//     try {
//       const attachment = attachments[0] || null; // Ensure correct structure
//       await sendChatMessage({
//         senderId: userId,
//         receiverId: selectedContact?.id, // Use correct field
//         text: inputValue.trim(),
//         attachment,
//       });
//       setInputValue("");
//     } catch (error) {
//       console.error("Error sending message:", error.message);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendChatMessage();
//     }
//   };

//   const triggerElement = <Link className="rounded-full size-6 p-1" />;

//   const menuItems = [
//     {
//       label: "Photos & Videos",
//       icon: <Images color="#007bfc" />,
//     },
//     {
//       label: "Documents",
//       icon: <FileText color={"#7f66ff"} />,
//     },
//   ];

//   return (
//     <div className="w-full p-4 border-t-2">
//       <div className="rounded-xl border-gray-300 flex flex-col gap-2">
//         <InputTextarea
//           placeholder="Type a message..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           disabled={isLoading} // Disable input while sending
//         />
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-1">
//             <Button
//               className="size-8 border-none rounded-full"
//               variant="outline"
//             >
//               <Smile />
//             </Button>

//             <DropdownMenuWrapper
//               triggerElement={triggerElement}
//               menuItems={menuItems}
//               className="left-0 ml-14"
//             />
//           </div>
//           <Button
//             type="submit"
//             variant="outline"
//             className="rounded-full h-9 flex"
//             onClick={handleSendChatMessage}
//             disabled={isLoading}
//           >
//             <span className="hidden lg:block">Send</span>
//             <SendHorizonal />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// ChatBoxFooter.propTypes = {
//   selectedContact: PropTypes.object,
//   userId: PropTypes.string,
// };

// export default ChatBoxFooter;

import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { FileText, Images, Link, SendHorizonal, Smile } from "lucide-react";
import { InputTextarea } from "@/components/ui/InputTextarea";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { useChatMessages } from "@/stores/useChatMessages";

const ChatBoxFooter = ({ selectedContact, userId }) => {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const { sendChatMessage, isLoading } = useChatMessages();

  const handleSendChatMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) {
      console.error("Message content is empty");
      return;
    }
    try {
      const attachment = attachments[0]?.base64 || null;
      await sendChatMessage({
        senderId: userId,
        receiverId: selectedContact?.id,
        text: inputValue.trim(),
        attachment,
      });
      setInputValue("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAttachments([{ file, preview: fileUrl }]);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setAttachments([{ file, preview: fileUrl, base64: base64String }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerElement = <Link className="rounded-full size-6 p-1" />;

  const menuItems = [
    {
      label: "Photos & Videos",
      icon: <Images color="#007bfc" />,
      onClick: triggerFilePicker,
    },
    {
      label: "Documents",
      icon: <FileText color={"#7f66ff"} />,
    },
  ];

  return (
    <div className="w-full p-4 border-t-2">
      <div className="rounded-xl border-gray-300 flex flex-col gap-2">
        <div className="flex flex-col gap-3 border rounded-lg p-2">
          {attachments.length > 0 && (
            <div className="flex items-center">
              <img
                src={attachments[0].preview}
                alt="Selected"
                className="size-16 object-cover rounded-md mr-2"
              />
              <button
                className="text-red-500 text-sm"
                onClick={() => setAttachments([])}
              >
                Remove
              </button>
            </div>
          )}
          <InputTextarea
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="border-0 p-0 h-10"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              className="size-8 border-none rounded-full"
              variant="outline"
            >
              <Smile />
            </Button>

            <DropdownMenuWrapper
              triggerElement={triggerElement}
              menuItems={menuItems}
              className="left-0 ml-14"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="rounded-full h-9 flex"
            onClick={handleSendChatMessage}
            disabled={isLoading}
          >
            <span className="hidden lg:block">Send</span>
            <SendHorizonal />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

ChatBoxFooter.propTypes = {
  selectedContact: PropTypes.object,
  userId: PropTypes.string,
};

export default ChatBoxFooter;
