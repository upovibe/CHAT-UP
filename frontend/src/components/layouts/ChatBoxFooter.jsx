import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Images, Link, SendHorizonal, Smile, X } from "lucide-react";
import { InputTextarea } from "@/components/ui/InputTextarea";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { useChatMessages } from "@/stores/useChatMessages";

const ChatBoxFooter = ({ selectedContact }) => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const { sendChatMessage, isLoading } = useChatMessages();
  const fileInputRef = useRef();
  const [isSending, setIsSending] = useState(false);

  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Only images are allowed.",
        status: "error",
      });
      console.error("Invalid file type. Only images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview([reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleSendChatMessage = async () => {
    if (isSending) return;

    setIsSending(true);

    if (!inputValue.trim() && imagePreview.length === 0) {
      console.error("Message content is empty, and no image is attached.");
      setIsSending(false);
      return;
    }

    if (!selectedContact?.id) {
      console.error("Selected contact is invalid or missing.");
      setIsSending(false);
      return;
    }

    try {
      const image = imagePreview[0] || null;
      await sendChatMessage({
        messageData: {
          text: inputValue.trim(),
          image,
        },
        userId: selectedContact.id,
      });
      setInputValue("");
      setImagePreview([]);
    } catch (error) {
      console.error("Error sending message:", error.message);
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const triggerElement = (
    <Button
      className="size-8 border-none rounded-full hover:bg-gray-500/30 transition-all duration-300 ease-linear"
      variant="outline"
    >
      <Link />
    </Button>
  );

  const menuItems = [
    {
      label: "Photos & Videos",
      icon: <Images color="#007bfc" />,
      onClick: () => fileInputRef.current.click(),
    },
    {
      label: "Documents",
      icon: <FileText color={"#7f66ff"} />,
    },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendChatMessage();
      }}
      className="w-full p-4 border-t-2"
    >
      <div className="rounded-xl border-gray-300 flex flex-col gap-2">
        <div className="flex flex-col gap-3 border rounded-lg p-2">
          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div className="w-fit relative">
              <img
                src={imagePreview[0]}
                alt="Selected"
                className="rounded-lg max-h-40 object-contain"
              />
              <X
                size={20}
                onClick={() => setImagePreview([])}
                className="cursor-pointer absolute top-0 right-0 bg-red-600/30 hover:bg-red-600/70 hover:backdrop-blur-sm rounded-full p-1 transition duration-300"
              />
            </div>
          )}

          {/* Input Text Area */}
          <InputTextarea
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="border-0 p-0 h-10"
          />
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelection}
            className="hidden"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              className="size-8 border-none rounded-full hover:bg-gray-500/30 transition-all duration-300 ease-linear"
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
            className="rounded-full h-9 flex text-gray-500"
            disabled={isLoading || isSending}
          >
            <span className="hidden lg:block text-gray-500">Send</span>
            <SendHorizonal className="text-gray-600" />
          </Button>
        </div>
      </div>
    </form>
  );
};

ChatBoxFooter.propTypes = {
  selectedContact: PropTypes.object,
  userId: PropTypes.string,
};

export default ChatBoxFooter;
