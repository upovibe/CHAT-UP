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
import { LogOut, MessageCircle, Clipboard, BellIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SearchDialog from "./SearchDialog";
import { useAuth } from "@/stores/useAuth";
import SettingsDialog from "@/components/layouts/SettingsDialog";
import Notification from "@/components/layouts/Notification";

const AuthBox = () => {
  const { logout, authUser } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <SearchDialog />
      <Notification />
      <div className="w-[1px] h-6 bg-black/10"></div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={authUser?.avatar} />
            <AvatarFallback>
              {authUser?.fullName
                ? `${authUser.fullName.charAt(0)}${authUser.fullName
                    .split(" ")[1]
                    ?.charAt(0)}`
                : "?"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-5">
          <DropdownMenuLabel className="flex items-center gap-2">
            {authUser?.fullName || "My Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
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
          <SettingsDialog />
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
