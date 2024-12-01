import { Button } from "@/components/ui/button";
import { FileText, Images, Link, SendHorizonal, Smile } from "lucide-react";
import { InputTextarea } from "@/components/ui/InputTextarea";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";

const ChatBoxFooter = () => {
  const triggerElement = (
    <Link className="rounded-full size-6 p-1" />
  );

  const menuItems = [
    {
      label: "Photos & Videos",
      icon: <Images color="#007bfc" />,
    },
    {
      label: "Documents",
      icon: <FileText color={"#7f66ff"} />,
    },
  ];

  return (
    <div className="w-full p-4 border-t-2">
      <div className="rounded-xl border-gray-300 flex flex-col gap-2">
        <InputTextarea placeholder="Type a message..." />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button className="size-8 border-none rounded-full" variant="outline">
              <Smile />
            </Button>

            {/* DropdownMenuWrapper without nested buttons */}
            <DropdownMenuWrapper
              triggerElement={triggerElement}
              menuItems={menuItems}
              className="left-0"
            />
          </div>

          <div>
            <Button type="submit" variant="outline" className="rounded-full h-9 flex">
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
