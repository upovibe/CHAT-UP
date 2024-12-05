import { useState, useEffect, useCallback } from "react";
import { useSearch } from "@/stores/useSearch";
import { useFriendRequests } from "@/stores/useFriendRequests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserX, } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animations/Loader.json";

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

  // Notify on success or error
  useEffect(() => {
    if (success) {
      toast({ title: "Success", description: success, status: "success" });
      setSendingTo(null);
      // Remove from sentRequests if success is a cancel request
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

  // Remove duplicate search results and map _id to id if necessary
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

  return (
    <div>
      <Dialog className="py-">
        <DialogTrigger className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 py-[3px] pl-1 pr-6 text-xs md:text-sm text-gray-500 rounded-md border-2 border-gray-400/50 gap-2">
          <Search className="mr-2 size-4" />
          Search new friends...
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="space-y-2">
            <DialogTitle>{""}</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              className="border-collapse focus-visible:ring-0 focus-visible:ring-offset-0"
              type="text"
              placeholder="Search new friends..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && debouncedSearch(query)}
            />
            <ul className="space-y-1 max-h-[300px] py-4 overflow-auto">
              {isSearching ? (
                Array(1)
                  .fill(null)
                  .map((_, index) => (
                    <li
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
                    </li>
                  ))
              ) : error ? (
                <li key={`error-${error}`} className="text-red-500">
                  Error: {error}
                </li>
              ) : uniqueResults.length > 0 ? (
                uniqueResults.map((user) => {
                  const isRequestSent = sentRequests.has(user.id);
                  return (
                    <li
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
                    </li>
                  );
                })
              ) : (
                <li key="no-results" className="text-gray-500 text-sm">
                  No users found matching &quot;{query.trim()}&quot;
                </li>
              )}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
