import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

const ListItem = ({ icon: Icon, title, badgeCount, authUser, link, avatar }) => {
  return (
    <li className="px-4 py-2 flex items-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
      <div className="flex items-center gap-3">
        {avatar && (
          <Avatar className="size-7 object-cover">
            <AvatarImage
              src={authUser?.avatar || "https://via.placeholder.com/150"}
            />
            <AvatarFallback>
              {authUser?.fullName
                ? `${authUser.fullName.charAt(0)}${authUser.fullName
                    .split(" ")[1]
                    ?.charAt(0)}`
                : "?"}
            </AvatarFallback>
          </Avatar>
        )}
        {!avatar && <Icon className="text-gray-400" />}
        <div className="flex items-center gap-1">
          <h3 className="font-bold whitespace-nowrap">{title}</h3>
          {badgeCount > 0 && (
            <Badge
              className="px-[5px] flex items-center justify-center"
              variant="destructive"
            >
              {badgeCount}
            </Badge>
          )}
        </div>
      </div>
      <span className="text-gray-400 font-bold whitespace-nowrap">{link}</span>
    </li>
  );
};

ListItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  badgeCount: PropTypes.number,
  authUser: PropTypes.object,
  link: PropTypes.string,
  avatar: PropTypes.bool,
};

ListItem.defaultProps = {
  badgeCount: 0,
  authUser: null,
  link: "",
  avatar: false,
};

export default ListItem;
