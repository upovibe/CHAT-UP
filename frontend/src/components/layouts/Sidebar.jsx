import PropTypes from "prop-types";import {
  Ban,
  Edit,
  MessagesSquare,
  MessageSquareDotIcon,
  SidebarClose,
  SidebarOpen,
  Users,
  Rss,
  Mail,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";

const Sidebar = ({isHidden}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      totalCount: 5,
    },
    {
      icon: <Users className="text-gray-400" />,
      label: "All",
      notificationCount: 7,
      totalCount: 100,
    },
    {
      icon: <MessageSquareDotIcon className="text-gray-400" />,
      label: "Live Chat",
      notificationCount: 15,
      totalCount: 20,
    },
    {
      icon: <MessagesSquare className="text-gray-400" />,
      label: "Groups",
      notificationCount: 5,
      totalCount: 10,
    },
    {
      icon: <Rss className="text-gray-400" />,
      label: "Channels",
      notificationCount: 2,
      totalCount: 12,
    },
    {
      icon: <Ban className="text-gray-400" />,
      label: "Blocked",
      notificationCount: null,
      totalCount: 3,
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
        className={`border-b-2 p-4 flex items-center justify-between ${
          isCollapsed ? "px-2" : "px-4"
        }`}
      >
        {windowWidth >= 1024 && (
          <button
            onClick={toggleCollapse}
            className="p-1 border-gray-300 border-2 text-gray-400 rounded-full"
          >
            {isCollapsed ? (
              <SidebarOpen className="size-5" />
            ) : (
              <SidebarClose className="size-5" />
            )}
          </button>
        )}
        {!isCollapsed && windowWidth >= 1024 && (
          <div className="mx-auto ml-3 flex items-center justify-between w-full">
            <h2 className="font-bold text-lg">Panel</h2>
            <Edit className="text-gray-500 size-5"/>
          </div>
        )}
        {windowWidth < 1024 && isCollapsed && (
          <div className="py-[0.37rem] w-fit mx-auto">
            <Edit className="text-gray-500 size-5"/>
          </div>
        )}
      </div>

      {/* Navigation Options */}
      <ul className="space-y-3 mt-4">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`p-2 flex items-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ${
              isCollapsed ? "mr-0 justify-center" : "mr-2 lg:rounded-r-full"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <div className="relative">
                {item.notificationCount && isCollapsed && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 text-xs"
                  >
                    {item.notificationCount}
                  </Badge>
                )}
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <h3 className="font-bold whitespace-nowrap">{item.label}</h3>
                  {item.notificationCount && (
                    <Badge variant="destructive">
                      {item.notificationCount}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-gray-400 font-bold">{item.totalCount}</span>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};

Sidebar.propTypes = {
  isHidden: PropTypes.func,
  toggleSidebar: PropTypes.func,
};

export default Sidebar;
