import { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/truncateText";
import Filter from "./Filter";
import {
  Contact,
  PanelRightClose,
  PanelLeftClose,
  Info,
  MailCheck,
  Trash,
  AlertTriangle,
  ShieldOff,
} from "lucide-react";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { Button } from "../ui/button";

const FriendList = ({
  onContactSelect,
  onToggleSidebar,
  isSidebarHidden,
  onProfileClick,
}) => {
  const [selectedContactId, setSelectedContactId] = useState(null);

  const triggerElement = (contact) => (
    <Avatar>
      <AvatarImage src={contact.avatar} alt={contact.name} />
      <AvatarFallback>{contact.name[0]}</AvatarFallback>
    </Avatar>
  );

  const menuItems = (contact) => [
    {
      label: "Contact Info",
      icon: <Info size={16} />,
      onClick: () => onProfileClick(contact),
    },
    {
      label: "Mark as read",
      icon: <MailCheck size={16} />,
      className: "lg:hidden",
    },
    {
      label: "Mute Notification",
      icon: <MailCheck size={16} />,
      onClick: () => console.log("Mute Notification clicked"),
    },
    {
      label: "Delete Chat",
      icon: <Trash size={16} />,
      onClick: () => console.log("Delete Chat clicked"),
    },
    {
      label: "Report",
      icon: <AlertTriangle size={16} />,
      onClick: () => console.log("Report clicked"),
    },
    {
      label: "Block",
      icon: <ShieldOff size={16} />,
      onClick: () => console.log("Block clicked"),
    },
  ];

  const contacts = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Hey!",
      time: "12:45",
      notifications: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: null,
      lastMessage: "What's up?",
      time: "11:30",
      notifications: 3,
    },
  ];

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.id);
    if (onContactSelect) onContactSelect(contact);
  };

  return (
    <div className="relative  border-r-2 transition-all duration-300 w-full md:w-4/12 lg:w-6/12 flex flex-col h-full">
      {/* Header */}
      <div className="px-3 h-14 border-b-2 flex items-center justify-between gap-5">
        <Button className="rounded-full size-9 flex" variant="outline"
          onClick={onToggleSidebar}
        >
          {isSidebarHidden ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </Button>
        <h2 className="font-bold whitespace-nowrap">Friend List</h2>
        <Contact className="size-5 text-gray-500" />
      </div>

      {/* Filters */}
      <Filter />

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto">
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className={`p-4 flex items-center gap-2 cursor-pointer border-r-4 transition-all ease-linear duration-200 border-b border-b-gray-200 dark:border-b-gray-800 hover:bg-blue-300/30 ${
                selectedContactId === contact.id
                  ? "border-r-blue-600 bg-blue-600/50"
                  : "border-transparent"
              }`}
            >
              <DropdownMenuWrapper
                className="absolute left-0"
                triggerElement={triggerElement(contact)}
                menuItems={menuItems(contact)}
              />
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-bold whitespace-nowrap leading-none">
                  {contact.name}
                </h3>
                <p className="truncate whitespace-nowrap leading-none text-gray-600 dark:text-white/50">
                  {truncateText(contact.lastMessage, 20)}
                </p>
              </div>
              <div className="flex ml-auto flex-col items-end justify-end">
                <span className="text-sm text-gray-500 dark:text-white/40">{contact.time}</span>
                {contact.notifications > 0 && (
                  <Badge className="bg-blue-500 hover:bg-blue-500 text-white">
                    {contact.notifications}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

FriendList.propTypes = {
  onContactSelect: PropTypes.func,
  onToggleSidebar: PropTypes.func,
  isSidebarHidden: PropTypes.bool,
  onProfileClick: PropTypes.func,
};

export default FriendList;
