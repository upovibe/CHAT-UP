import { Check, EllipsisVertical, X } from "lucide-react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/truncateText";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";

const ChatBoxHeader = ({ onClose, onProfileClick }) => {
  return (
    <div className="py-[0.64rem] px-4 md:p-3 lg:px-4 lg:py-[0.63rem] border-b-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="cursor-pointer" onClick={onProfileClick}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold whitespace-nowrap leading-none">
            {truncateText("Recipient Name", 15)}
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Active</span>
            <span className="size-2 rounded-full bg-[green]"></span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <Button className="rounded-full h-9 hidden lg:flex" variant="outline">
          <Check /> Mark As Read
        </Button>
        <DropdownMenuWrapper
        className="right-0"
          triggerElement={
            <Button className="rounded-full size-8" variant="outline">
              <EllipsisVertical />
            </Button>
          }
          menuItems={[
            { label: "Contact Info", onClick: onProfileClick },
            { label: "Mark as read", className: "lg:hidden", },
            { label: "Mute Notification" },
            { label: "Delete Chat" },
            { label: "Report" },
            { label: "Close Chat", className: "lg:hidden", onClick: onClose },
            { label: "Block" },
          ]}
        />
        <Button
          onClick={onClose}
          className="rounded-full size-8 md:hidden"
          variant="outline"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

ChatBoxHeader.propTypes = {
  onClose: PropTypes.func,
  onProfileClick: PropTypes.func,
};

export default ChatBoxHeader;
