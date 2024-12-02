import { useState, useEffect } from "react";
import { useSearch } from "@/store/useSearch";
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

const SearchDialog = () => {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, isSearching, error } = useSearch();

  const handleSearch = () => {
    if (query.trim()) {
      searchUsers(query);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      const handleSearch = () => {
        searchUsers(query);
      };
      handleSearch();
    }
  }, [query, searchUsers]);

  const uniqueResults = searchResults.filter(
    (user, index, self) =>
      index ===
      self.findIndex((u) => u.id === user.id || u.username === user.username)
  );

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
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
            </DialogTitle>
            <DialogDescription className="mr-auto">Lists</DialogDescription>
          </DialogHeader>
          <ul className="space-y-1 max-h-[300px] overflow-auto">
            {isSearching ? (
              // Show skeleton while searching
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
              // Show error message
              <li key={`error-${error}`} className="text-red-500">
                Error: {error}
              </li>
            ) : uniqueResults.length > 0 ? (
              // Display unique search results
              uniqueResults.map((user) => (
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
                  <Toggle aria-label="Toggle italic">Add</Toggle>
                </li>
              ))
            ) : (
              // Show message when no results are found
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
