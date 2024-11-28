import { Contact } from "lucide-react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/truncateText";

const FriendList = ({ isSidebarExpanded, onProfileClick }) => {
  const longText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis iure doloremque, non qui vel rem provident odio ea error. Dolorum doloremque incidunt, consequatur assumenda expedita recusandae itaque ipsum quis unde.";

  const shouldShowOnlyAvatar = !isSidebarExpanded || window.innerWidth <= 768; // Check for `w-fit` or small/medium screens.

  return (
    <div
      className={`bg-white border-r-2 transition-all duration-300 overflow-hidden ${
        isSidebarExpanded ? "md:w-4/12 lg:w-3/12 w-full" : "w-fit"
      }`}
    >
      {shouldShowOnlyAvatar ? (
        <div className="p-4 flex items-center justify-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div>
          <div className="p-4 border-b-2 flex items-center justify-between">
            <h2 className="md:text-lg font-bold whitespace-nowrap">
              ContactList
            </h2>
            <Contact className="size-5 text-gray-500" />
          </div>
          <ul className="space-y-3">
            <li
              onClick={onProfileClick}
              className="p-4 flex items-center gap-2 cursor-pointer border-r-4 border-transparent hover:border-r-blue-600 transition-all ease-linear duration-200 border-b border-b-gray-200 hover:bg-blue-50/30"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-bold whitespace-nowrap leading-none">FullName</h3>
                <p className="truncate whitespace-nowrap leading-none text-gray-500">
                  {truncateText(longText, 10)}
                </p>
              </div>
              <div className="ml-auto flex flex-col items-end justify-end">
                <span className="text-sm text-gray-400">12:45</span>
                <Badge variant="destructive">5</Badge>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

FriendList.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default FriendList;
