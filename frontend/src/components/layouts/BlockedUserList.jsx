import PropTypes from "prop-types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import { EllipsisVertical, CheckCircle, Unlock } from "lucide-react";
import { Button } from "../ui/button";
import SkeletonList from "@/components/layouts/SkeletonList";
import { useFriendRequests } from "@/stores/useFriendRequests";

const BlockedUserList = ({ onProfileClick }) => {
  const { toast } = useToast();
  const {
    blockedFriends,
    getBlockedFriends,
    unblockUser,
    blockedFriendsCount,
    loading,
  } = useBlockFriend();
  const [query, setQuery] = useState("");
  const { getFriendsList } = useFriendRequests();
  const [filteredBlockedFriends, setFilteredBlockedFriends] = useState([]);

  useEffect(() => {
    getBlockedFriends();
  }, [getBlockedFriends]);

  useEffect(() => {
    if (blockedFriends) {
      setFilteredBlockedFriends(blockedFriends);
    }
  }, [blockedFriends]);

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId);
      const success = "User unblocked successfully";
      toast({ title: "Success", description: success, status: "success" });
      await getBlockedFriends();
      getFriendsList();
    } catch (error) {
      const unblockError = "Error unblocking user";
      toast({ title: "Error", description: unblockError, status: "error" });
      console.error(unblockError, error);
    }
  };

  const menuItems = (blockedUser) => [
    {
      label: "View Profile",
      icon: <CheckCircle size={16} />,
      onClick: () => onProfileClick(blockedUser),
    },
    {
      label: "Unblock",
      icon: <Unlock size={16} />,
      onClick: () => handleUnblockUser(blockedUser._id),
    },
  ];

  const triggerElement = () => (
    <Button variant="ghost" className="ml-auto">
      <EllipsisVertical className="" />
    </Button>
  );

  const filteredBlocked = filteredBlockedFriends.filter(
    (user) =>
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.userName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Command>
      <Input
        className="border-t-0 border-r-0 border-l-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        type="text"
        placeholder="Search blocked users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <CommandList>
        <CommandGroup heading={`Blocked Users: ${blockedFriendsCount}`}>
          {loading ? (
            [...Array(1)].map((_, index) => (
              <li
                key={index}
                className="p-4 flex items-center gap-2 cursor-pointer border-b border-b-gray-200 dark:border-b-gray-800"
              >
                <SkeletonList />
              </li>
            ))
          ) : filteredBlocked.length > 0 ? (
            filteredBlocked.map((user) => (
              <CommandItem
                key={user._id}
                className="flex items-center gap-3 w-full"
              >
                <Avatar onClick={() => onProfileClick(user)} className="cur">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.fullName
                      ? `${user.fullName.charAt(0)}${user.fullName
                          .split(" ")[1]
                          ?.charAt(0)}`
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-gray-500">@{user.userName}</div>
                </div>
                <DropdownMenuWrapper
                  key={user._id}
                  className="absolute right-0"
                  triggerElement={triggerElement()}
                  menuItems={menuItems(user)}
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

BlockedUserList.propTypes = {
  onProfileClick: PropTypes.func,
};

export default BlockedUserList;
