import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect, useCallback } from "react";
import { useSearch } from "@/stores/useSearch";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, UserX } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animations/Loader.json";
import { Input } from "../ui/input";

const SearchDialog = () => {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, isSearching, error } = useSearch();
  const {
    sendFriendRequest,
    cancelFriendRequest,
    loading,
    success,
    error: friendError,
  } = useFriendRequests();
  const { toast } = useToast();
  const [sendingTo, setSendingTo] = useState(null);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [open, setOpen] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (query) => {
      if (query.trim()) {
        searchUsers(query);
      }
    },
    [searchUsers]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => debouncedSearch(query), 500);
    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (success) {
      toast({ title: "Success", description: success, status: "success" });
      setSendingTo(null);
      setSentRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(success.receiverId);
        return newSet;
      });
    }
    if (friendError) {
      toast({ title: "Error", description: friendError, status: "error" });
      setSendingTo(null);
    }
  }, [success, friendError, toast]);

  const uniqueResults = searchResults
    .filter(
      (user, index, self) =>
        index ===
        self.findIndex((u) => u.id === user.id || u.username === user.username)
    )
    .map((user) => {
      if (!user.id && user._id) {
        user.id = user._id;
      }
      return user;
    });

  const handleSendRequest = async (userId) => {
    setSendingTo(userId);
    await sendFriendRequest(userId);
    setSentRequests((prev) => new Set(prev).add(userId));
  };

  const handleCancelRequest = async (userId) => {
    setSendingTo(userId);
    await cancelFriendRequest(userId);
  };

  useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 py-[3px] pl-1 pr-6 text-[12px] md:text-sm text-gray-500 rounded-md border-2 border-gray-400/50 gap-2 cursor-pointer"
      >
        <Search className="mr-2 size-4" />
        Search new friends...{" "}
        <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} className="">
        <Input
          className="border-t-0 border-r-0 border-l-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          type="text"
          placeholder="Search new friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && debouncedSearch(query)}
        />
        <CommandList>
          <ul className="space-y-1 max-h-[300px] py-4 overflow-auto">
            {isSearching ? (
              Array(1)
                .fill(null)
                .map((_, index) => (
                  <CommandItem
                    key={`skeleton-placeholder-${index}`}
                    className="flex items-center justify-between space-x-4 border-t border-b py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                    <Skeleton className="size-5 p-3" />
                  </CommandItem>
                ))
            ) : error ? (
              <CommandEmpty key={`error-${error}`} className="text-red-500">
                Error: {error}
              </CommandEmpty>
            ) : uniqueResults.length > 0 ? (
              uniqueResults.map((user) => {
                const isRequestSent = sentRequests.has(user.id);
                return (
                  <CommandItem
                    key={user.id ?? `fallback-${user.username}`}
                    className="flex items-center justify-between transition-all ease-linear duration-200 border-t border-b py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.fullName.charAt(0)}
                          {user.fullName.split(" ")[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.userName}
                        </div>
                      </div>
                    </div>
                    <Toggle
                      aria-label={
                        isRequestSent
                          ? "Cancel friend request"
                          : "Send friend request"
                      }
                      onClick={() =>
                        isRequestSent
                          ? handleCancelRequest(user.id)
                          : handleSendRequest(user.id)
                      }
                      size="sm"
                      disabled={sendingTo === user.id || loading}
                      className={`text-white ${
                        isRequestSent ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {sendingTo === user.id ? (
                        <Lottie
                          className="w-full lottie"
                          animationData={loadingAnimation}
                          loop={true}
                        />
                      ) : isRequestSent ? (
                        <UserX className="" />
                      ) : (
                        <UserPlus className="" />
                      )}
                    </Toggle>
                  </CommandItem>
                );
              })
            ) : (
              <CommandEmpty>
                {" "}
                No users found matching &quot;{query.trim()}&quot;
              </CommandEmpty>
            )}
          </ul>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchDialog;
