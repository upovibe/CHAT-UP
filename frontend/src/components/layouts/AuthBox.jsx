import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  MessageCircle,
  Clipboard,
  Settings,
  BellIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import SearchDialog from "../ui/SearchDialog";
import { useAuth } from "@/store/useAuth";

const AuthBox = () => {
  const { logout, authUser } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <SearchDialog />
      <Link
        to="/notifications"
        className="flex items-center text-gray-700 hover:text-blue-600 font-bold transition-all ease-linear duration-200"
      >
        <div className="flex relative">
          <BellIcon className="size-5" />
          <Badge
            className="absolute top-0 right-0 px-[3px] size-2"
            variant="destructive"
          >
          </Badge>
        </div>
      </Link>
      <div className="w-[1px] h-6 bg-black/10"></div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={authUser?.Avatar || "https://via.placeholder.com/150"} />
            <AvatarFallback>
              {authUser?.fullName
                ? `${authUser.fullName.charAt(0)}${authUser.fullName.split(' ')[1]?.charAt(0)}`
                : "?"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-5">
          <DropdownMenuLabel className="flex items-center gap-2">
            {authUser?.fullName || "My Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="#">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <div className="block lg:hidden">
            <Link to="/conversation">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <MessageCircle className="size-4" />
                Conversation
              </DropdownMenuItem>
            </Link>
            <Link to="/campaign">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Clipboard className="size-4" />
                Campaign
              </DropdownMenuItem>
            </Link>
          </div>
          <Link to="/settings">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthBox;
