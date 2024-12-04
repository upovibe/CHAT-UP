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
import { UserPlus, UserCheck } from "lucide-react";

const SearchDialog = () => {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, isSearching, error } = useSearch();
  const { sendRequest, fetchSentRequests, sentRequests } = useFriendRequests();
  const { toast } = useToast();

  const [localSentRequests, setLocalSentRequests] = useState([]);

  // Load sent requests on component mount
  useEffect(() => {
    const loadSentRequests = async () => {
      try {
        await fetchSentRequests();
        setLocalSentRequests(sentRequests);
      } catch (error) {
        console.error("Error loading sent requests:", error);
        const storedRequests =
          JSON.parse(localStorage.getItem("sentRequests")) || [];
        setLocalSentRequests(storedRequests);
      }
    };
    loadSentRequests();
  }, [fetchSentRequests, sentRequests]);

  // Listen for sent requests changes in Zustand and persist to localStorage
  useEffect(() => {
    setLocalSentRequests(sentRequests);
  }, [sentRequests]);

  // Persist sentRequests to localStorage
  useEffect(() => {
    localStorage.setItem("sentRequests", JSON.stringify(localSentRequests));
  }, [localSentRequests]);

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

  // Handle sending friend requests
  const sendFriendRequest = async (userId) => {
    if (!userId || localSentRequests.includes(userId)) {
      toast({
        description: "Friend request already sent.",
        status: "info",
      });
      return;
    }

    try {
      await sendRequest(userId);
      setLocalSentRequests((prev) => [...prev, userId]);
      toast({
        description: "Your friend request has been sent.",
        status: "success",
      });
    } catch (error) {
      console.error("Error sending request:", error.message);
      toast({
        description: "Could not send the friend request.",
        status: "error",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 py-[3px] pl-1 pr-6 text-xs md:text-sm text-gray-500 rounded-md border-2 border-gray-400/50 gap-2">
          <Search className="mr-2 size-4" />
          Search new friends...
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="space-y-2">
            <DialogTitle className="mt-3">
              <Input
                className="border-collapse focus-visible:ring-0 focus-visible:ring-offset-0"
                type="text"
                placeholder="Search new friends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && debouncedSearch(query)}
              />
            </DialogTitle>
            <DialogDescription className="mr-auto">Lists</DialogDescription>
          </DialogHeader>
          <ul className="space-y-1 max-h-[300px] overflow-auto">
            {isSearching ? (
              Array(1)
                .fill(null)
                .map((_, index) => (
                  <li
                    key={`skeleton-placeholder-${index}`}
                    className="flex items-center space-x-4 p-2 rounded-lg"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </li>
                ))
            ) : error ? (
              <li key={`error-${error}`} className="text-red-500">
                Error: {error}
              </li>
            ) : uniqueResults.length > 0 ? (
              uniqueResults.map((user) => {
                return (
                  <li
                    key={user.id ?? `fallback-${user.username}`}
                    className="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition-all ease-linear duration-200"
                  >
                    <div className="flex items-center space-x-4">
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
                      aria-label="Send friend request"
                      onClick={() => sendFriendRequest(user.id)}
                    >
                      {localSentRequests.includes(user.id) ? (
                        <UserCheck className="text-green-500" />
                      ) : (
                        <UserPlus className="text-gray-500" />
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;