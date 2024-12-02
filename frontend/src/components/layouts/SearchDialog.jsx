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

const SearchDialog = () => {
  const users = [
    {
      fullName: "Shad CN",
      username: "shadcn",
      imageUrl: "https://github.com/shadcn.png",
    },
    {
      fullName: "Jane Doe",
      username: "janedoe",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      fullName: "John Smith",
      username: "johnsmith",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

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
              />
            </DialogTitle>
            <DialogDescription className="mr-auto">Lists </DialogDescription>
          </DialogHeader>
          <ul className="space-y-1">
            {users.map((user, index) => (
              <li key={index} className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition-all ease-linear duration-200">
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>
                    {user.fullName.charAt(0)}
                    {user.fullName.split(" ")[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
