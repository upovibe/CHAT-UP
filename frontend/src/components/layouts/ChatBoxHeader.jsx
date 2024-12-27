import {
  Check,
  EllipsisVertical,
  Info,
  MailCheck,
  Trash,
  AlertTriangle,
  X,
  ShieldOff,
  XCircle,
  MessageSquareOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/truncateText";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { useBlockFriend } from "@/stores/useBlockFriend";
import { useAuth } from "@/stores/useAuth";

const ChatBoxHeader = ({ onClose, selectedContact, onProfileClick }) => {
  const { toast } = useToast();
  const { getFriendsList } = useFriendRequests();
  const { onlineUsers } = useAuth();

  const { blockUser, getBlockedFriends } = useBlockFriend();

  const handleBlockUser = async (selectedContactId) => {
    try {
      await blockUser(selectedContactId);
      toast({
        title: "Success",
        description: "User blocked successfully",
        status: "success",
      });
      getFriendsList();
      getBlockedFriends();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error blocking user",
        status: "error",
      });
      console.error("Error blocking user:", error);
    }
  };

  const triggerElement = (
    <EllipsisVertical className="rounded-full size-8 border-2 p-1 cursor-pointer" />
  );

  const menuItems = [
    {
      label: "Contact Info",
      icon: <Info size={16} />,
      onClick: () => onProfileClick(selectedContact),
    },
    {
      label: "Mute Notification",
      icon: <MessageSquareOff size={16} />,
      onClick: () => console.log("Mute Notification clicked"),
    },
    {
      label: "Delete Chat",
      icon: <Trash size={16} />,
      onClick: () => console.log("Delete Chat clicked"),
    },
    {
      label: "Report",
      icon: <AlertTriangle size={16} />,
      onClick: () => console.log("Report clicked"),
    },
    {
      label: "Close Chat",
      icon: <XCircle size={16} />,
      className: "lg:hidden",
      onClick: onClose,
    },
    {
      label: "Block",
      icon: <ShieldOff size={16} />,
      onClick: () => handleBlockUser(selectedContact?.id),
    },
  ];

  return (
    <div className="px-4 py-3 md:py-[0.45rem] border-b-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar
          className="cursor-pointer"
          onClick={() => onProfileClick(selectedContact)}
        >
          <AvatarImage
            src={selectedContact?.avatar}
            alt={selectedContact?.fullName || "User Avatar"}
          />
          <AvatarFallback>
            {selectedContact?.fullName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold whitespace-nowrap leading-none">
            {truncateText(selectedContact?.fullName || "Unknown User", 15)}
          </h2>
          <div className="flex items-center gap-1">
            {selectedContact?.isOnline && (
              <span className="size-2 rounded-full bg-green-500"></span>
            )}
            <div className="text-gray-500 text-sm">
              {onlineUsers.includes(selectedContact.id) ? (
                <span className="text-green-500 font-semibold lg:font-bold">Online</span>
              ) : (
                "Offline"
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <DropdownMenuWrapper
          className="absolute right-0"
          triggerElement={triggerElement}
          menuItems={menuItems}
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
  onClose: PropTypes.func.isRequired,
  selectedContact: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    avatar: PropTypes.string,
    isOnline: PropTypes.bool,
  }),
  onProfileClick: PropTypes.func.isRequired,
};

export default ChatBoxHeader;
