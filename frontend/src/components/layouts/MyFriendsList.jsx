import PropTypes from "prop-types";
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

const MyFriendsList = ({ onContactSelect, onProfileClick }) => {
//   const [selectedContactId, setSelectedContactId] = useState(null);
  const [ setSelectedContactId] = useState(null);
  const { friendsList, getFriendsList, error, totalFriends } =
    useFriendRequests();
  const {
    blockedFriends,
    blockUser,
    unblockUser,
    getBlockedFriends,
    loading: blockLoading,
  } = useBlockFriend();
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getFriendsList();
    getBlockedFriends();
  }, [getFriendsList, getBlockedFriends]);

  useEffect(() => {
    if (friendsList) {
      setFriends(friendsList);
    }
  }, [friendsList]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isBlocked = (friendId) =>
    blockedFriends.some((blocked) => blocked._id === friendId);

  const handleBlockToggle = async (friend) => {
    if (isBlocked(friend._id)) {
      await unblockUser(friend._id);
    } else {
      await blockUser(friend._id);
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
      label: "Mark as read",
      icon: <MailCheck size={16} />,
      className: "lg:hidden",
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
      label: isBlocked(friend._id) ? "Unblock" : "Block",
      icon: <ShieldOff size={16} />,
      onClick: () => handleBlockToggle(friend),
      disabled: blockLoading,
    },
  ];

  const triggerElement = () => (
    <Button variant="ghost" className="ml-auto">
      <EllipsisVertical className="" />
    </Button>
  );

  const filteredFriends = friends.filter(
    (friend) =>
      friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
      friend.userName.toLowerCase().includes(query.toLowerCase())
  );

  const handleContactSelect = (friend) => {
    setSelectedContactId(friend.id);
    if (onContactSelect) onContactSelect(friend);
  };

  return (
    <div className="">
      <Command>
        <Input
          className="border-t-0 border-r-0 border-l-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          type="text"
          placeholder="Search new friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CommandList>
          <CommandGroup heading={`Total Friends ${totalFriends}`}>
            {filteredFriends.map((friend) => (
              <CommandItem
                key={friend._id}
                className="flex items-center gap-3 w-full"
              >
                <Avatar
                  onClick={() => onProfileClick(friend)}
                  className="cursor-pointer"
                >
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
                  <div className="text-sm text-gray-500">
                    @{friend.userName}
                  </div>
                </div>
                <DropdownMenuWrapper
                  key={friend._id}
                  className="absolute right-0"
                  triggerElement={triggerElement()}
                  menuItems={menuItems(friend)}
                />
                <CommandSeparator />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>
            No users found matching &quot;{query.trim()}&quot;
          </CommandEmpty>
        </CommandList>
      </Command>
    </div>
  );
};

MyFriendsList.propTypes = {
  onContactSelect: PropTypes.func,
  onProfileClick: PropTypes.func,
};

export default MyFriendsList;
