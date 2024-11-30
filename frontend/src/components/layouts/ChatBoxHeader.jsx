import { Check, EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/truncateText";

const ChatBoxHeader = () => {
  return (
    <div className="py-[0.64rem] px-4 md:p-3 lg:px-4 lg:py-[0.63rem] border-b-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="hidden lg:block">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold whitespace-nowrap leading-none">
            {truncateText("Recipient Name", 15)}
          </h2>
          <span className="text-sm text-gray-500">Active</span>
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
            <DropdownMenuItem>Contact Info</DropdownMenuItem>
            <DropdownMenuItem>Close Chat</DropdownMenuItem>
            <DropdownMenuItem>Mute Notification</DropdownMenuItem>
            <DropdownMenuItem>Delete Chat</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
