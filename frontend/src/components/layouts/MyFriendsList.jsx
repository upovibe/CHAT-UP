import PropTypes from "prop-types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { useBlockFriend } from "@/stores/useBlockFriend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { Input } from "@/components/ui/input";
import {
  EllipsisVertical,
  Info,
  MailCheck,
  Trash,
  AlertTriangle,
  ShieldOff,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import SkeletonList from "@/components/layouts/SkeletonList";

const MyFriendsList = ({ onContactSelect, onProfileClick }) => {
  const { toast } = useToast();
  const { blockUser, getBlockedFriends } = useBlockFriend();
  const { friendsList, getFriendsList, error, totalFriends, loading } =
    useFriendRequests();
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);

  useEffect(() => {
    if (friendsList) {
      setFriends(friendsList);
    }
  }, [friendsList]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleBlockUser = async (friendId) => {
    try {
      await blockUser(friendId);
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

  const menuItems = (friend) => [
    {
      label: "Open Chat",
      icon: <MessageCircle size={16} />,
      onClick: () => handleContactSelect(friend),
    },
    {
      label: "Contact Info",
      icon: <Info size={16} />,
      onClick: () => onProfileClick(friend),
    },
    {
      label: "Mute Notification",
      icon: <MailCheck size={16} />,
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
      label: "Block",
      icon: <ShieldOff size={16} />,
      onClick: () => handleBlockUser(friend.id),
    },
  ];

  const triggerElement = () => (
    <Button variant="outline" size="icon" className="ml-auto">
      <EllipsisVertical className="" />
    </Button>
  );

  const filteredFriends = friends.filter(
    (friend) =>
      friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
      friend.userName.toLowerCase().includes(query.toLowerCase())
  );

  const handleContactSelect = (friend) => {
    onContactSelect(friend.id);
  };

  return (
    <Command>
      <Input
        className="border-t-0 border-r-0 border-l-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        type="text"
        placeholder="Search new friends..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <CommandList>
        <CommandGroup heading={`Total Friends: ${totalFriends}`}>
          {loading ? (
            [...Array(1)].map((_, index) => (
              <li
                key={index}
                className="p-4 flex items-center gap-2 cursor-pointer border-b border-b-gray-200 dark:border-b-gray-800"
              >
                <SkeletonList />
              </li>
            ))
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <CommandItem
                key={friend._id}
                className="flex items-center gap-3 w-full"
              >
                <Avatar onClick={() => onProfileClick(friend)} className="cur">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>
                    {friend.fullName
                      ? `${friend.fullName.charAt(0)}${friend.fullName
                          .split(" ")[1]
                          ?.charAt(0)}`
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {friend.fullName}
                  </div>
                  <div className="text-sm text-gray-500">@{friend.userName}</div>
                </div>
                <DropdownMenuWrapper
                  key={friend._id}
                  className="absolute right-0"
                  triggerElement={triggerElement()}
                  menuItems={menuItems(friend)}
                />
                <CommandSeparator />
              </CommandItem>
            ))
          ) : (
            <CommandEmpty>
              No users found matching &quot;{query.trim()}&quot;
            </CommandEmpty>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

MyFriendsList.propTypes = {
  onContactSelect: PropTypes.func,
  onProfileClick: PropTypes.func,
};

export default MyFriendsList;
