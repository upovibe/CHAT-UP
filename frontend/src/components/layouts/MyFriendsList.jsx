// FriendsList.js
import { useState, useEffect } from "react";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "../ui/input";

const FriendsList = () => {
  const { friendsList, getFriendsList, error, totalFriends } =
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

  const filteredFriends = friends.filter(
    (friend) =>
      friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
      friend.userName.toLowerCase().includes(query.toLowerCase())
  );

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
              <CommandItem key={friend._id}>
                <div className="flex items-center gap-3">
                  <Avatar>
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
                </div>
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

export default FriendsList;
