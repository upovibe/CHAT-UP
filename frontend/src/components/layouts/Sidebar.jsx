import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import {
  Ban,
  Edit,
  Users,
  Mail,
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  SettingsIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/stores/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Settings from "@/pages/settings/Settings";
import { Button } from "../ui/button";
import { useFriendRequests } from "@/stores/useFriendRequests";
import FriendRequests from "./FriendRequests";

const Sidebar = ({ isHidden, onProfileClick }) => {
  const { authUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeContent, setActiveContent] = useState(null);
  const { pendingCount, cancelledCount, receivedCount } = useFriendRequests();  

  const totalNotifications = pendingCount + cancelledCount + receivedCount;

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsCollapsed(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    {
      icon: <Mail className="text-gray-400" />,
      label: "Inbox",
      notificationCount: 2,
    },
    {
      icon: <Users className="text-gray-400" />,
      label: "All",
      notificationCount: totalNotifications,
      content: <FriendRequests />,
    },
    {
      icon: <Ban className="text-gray-400" />,
      label: "Blocked",
      notificationCount: 1,
    },
  ];

  return (
    <div
      className={`transition-all duration-300 p-0 border-r-2 ${
        isCollapsed ? "w-fit" : "w-[14rem]"
      } ${isHidden ? "hidden" : "block md:block"}`}
    >
      {/* Header */}
      <div
        className={`border-b-2 h-14 flex items-center justify-between px-2 ${
          isCollapsed ? "" : ""
        }`}
      >
        {windowWidth >= 1024 && (
          <Button
            className="rounded-full size-9 hidden lg:flex"
            variant="outline"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ArrowRightFromLineIcon />
            ) : (
              <ArrowLeftFromLineIcon />
            )}
          </Button>
        )}
        {!isCollapsed && windowWidth >= 1024 && (
          <div className="mx-auto ml-3 flex items-center justify-between w-full">
            <h2 className="font-bold text-lg">Panel</h2>
            <Edit className="text-gray-500 size-5" />
          </div>
        )}
        {windowWidth < 1024 && isCollapsed && (
          <div className="py-[0.37rem] w-fit mx-auto">
            <Edit className="text-gray-500 size-5" />
          </div>
        )}
      </div>

      {/* Navigation Options */}
      <ul className="space-y-3 pt-4 flex flex-col  h-[calc(100vh-13rem)]">
        {navItems.map((item, index) => (
          <Dialog key={index}>
            {/* Dialog Trigger wraps the `li` */}
            <DialogTrigger asChild>
              <li
                className={`p-2 flex items-center cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ${
                  isCollapsed ? "mr-0 justify-center" : "mr-2 lg:rounded-r-full"
                }`}
                onClick={() => setActiveContent(item.content)}
              >
                <div className="relative flex items-center gap-3">
                {item.icon}
                  {!isCollapsed && (
                      <h3 className="font-bold whitespace-nowrap">
                      {item.label}
                    </h3>
                  )}
                </div>
                {!isCollapsed && (
                  <Badge className="text-white bg-blue-500 font-extrabold py-[0.5px] flex items-center ml-auto">
                    {item.notificationCount}
                  </Badge>
                )}
              </li>
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{""}</DialogTitle>
                <DialogDescription>{""}</DialogDescription>
              </DialogHeader>
              {activeContent}
            </DialogContent>
          </Dialog>
        ))}
      </ul>

      <div>
        <div
          onClick={onProfileClick}
          className={`p-2 flex items-center gap-3 cursor-pointer hover:text-blue-500 dark:hover:text-blue-950 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ${
            isCollapsed ? "mx-auto justify-center" : "mr-2 lg:rounded-r-full"
          }`}
        >
          <Avatar className="cursor-pointer size-7">
            <AvatarImage src={authUser?.avatar} />
            <AvatarFallback>
              {authUser?.fullName
                ? `${authUser.fullName.charAt(0)}${authUser.fullName
                    .split(" ")[1]
                    ?.charAt(0)}`
                : "?"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className="font-bold ">{authUser?.fullName}</span>
          )}
        </div>

        <Dialog>
          <DialogTrigger
            className={`p-2 flex items-center gap-3 cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ${
              isCollapsed
                ? "mx-auto justify-center"
                : "mr-2 lg:rounded-r-full w-full"
            }`}
          >
            <SettingsIcon className="" />
            {!isCollapsed && <span className="font-bold ">Settings</span>}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <Settings />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isHidden: PropTypes.bool,
  toggleSidebar: PropTypes.func,
  onProfileClick: PropTypes.func.isRequired,
};

export default Sidebar;
