import { Contact } from "lucide-react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/truncateText";
import Filter from "./Filter";

const FriendList = ({ isSidebarExpanded, onProfileClick }) => {
  const longText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis iure doloremque, non qui vel rem provident odio ea error. Dolorum doloremque incidunt, consequatur assumenda expedita recusandae itaque ipsum quis unde.";

  return (
    <div
      className={`bg-white border-r-2 transition-all duration-300 overflow-hidden lg:w-4/12 xl:w-3/12 ${
        isSidebarExpanded ? "w-fit" : "w-fit"
      }`}
    >
      <div className="p-[1.12rem] md:p-5 lg:p-4 border-b-2 flex items-center lg:justify-between justify-center">
        <h2 className="hidden lg:block md:text-lg font-bold whitespace-nowrap">
          ContactList
        </h2>
        <Contact className="size-5 text-gray-500" />
      </div>
      <Filter/>
      <ul className="space-y-3">
        <li
          onClick={onProfileClick}
          className="p-4 flex items-center gap-2 cursor-pointer border-r-4 border-transparent hover:border-r-blue-600 transition-all ease-linear duration-200 border-b border-b-gray-200 hover:bg-blue-50/30"
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Badge
              className="absolute -top-1 -right-1 lg:hidden"
              variant="destructive"
            >
              5
            </Badge>
          </div>
          {/* The following wrapper will hide all content except the avatar on sm and md screens */}
          <div className="hidden lg:flex flex-col items-start gap-1">
            <h3 className="font-bold whitespace-nowrap leading-none">
              FullName
            </h3>
            <p className="truncate whitespace-nowrap leading-none text-gray-500">
              {truncateText(longText, 10)}
            </p>
          </div>
          <div className="hidden lg:flex ml-auto flex-col items-end justify-end">
            <span className="text-sm text-gray-400">12:45</span>
            <Badge variant="destructive">5</Badge>
          </div>
        </li>
      </ul>
    </div>
  );
};

FriendList.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default FriendList;
