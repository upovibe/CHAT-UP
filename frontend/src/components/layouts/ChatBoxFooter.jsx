import { Button } from "@/components/ui/button";
import { FileText, Images, Link, SendHorizonal, Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputTextarea } from "@/components/ui/InputTextarea";

const ChatBoxFooter = () => {
  return (
    <div className="w-full p-4 border-t-2">
    <div className="rounded-xl border-gray-300 flex flex-col gap-2">
      <InputTextarea placeholder="Type a message..." />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            className="size-8 border-none rounded-full"
            variant="outline"
          >
            <Smile />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                className="size-8 border-none rounded-full"
                variant="outline"
              >
                <Link />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit whitespace-nowrap">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Images color="#007bfc" />
                <span>Photos & Videos</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FileText color={"#7f66ff"} />
                <span>Documents</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Button
            type="submit"
            variant="outline"
            className="rounded-full h-9 flex"
          >
            <span className="hidden lg:block">Send</span>
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ChatBoxFooter;
