import { Check, EllipsisVertical, X } from "lucide-react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/truncateText";

const ChatBoxHeader = ({ onClose, onProfileClick }) => {
  return (
    <div className="py-[0.64rem] px-4 md:p-3 lg:px-4 lg:py-[0.63rem] border-b-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="">
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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="rounded-full size-8" variant="outline">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute right-0 w-fit whitespace-nowrap">
            <DropdownMenuItem className="cursor-pointer" onClick={onProfileClick}>Contact Info</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer lg:hidden">Mark as read</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Mute Notification</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Delete Chat</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer lg:hidden" onClick={onClose}>Close Chat</DropdownMenuItem> 
            <DropdownMenuItem className="cursor-pointer">Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Close Button for Small Screens */}
        <Button
          onClick={onClose}
          className="rounded-full size-8 md:hidden" variant="outline"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

ChatBoxHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default ChatBoxHeader;
