import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/truncateText";
import Filter from "./Filter";
import { Contact, PanelRightClose, PanelLeftClose } from "lucide-react";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";

const FriendList = ({
  onContactSelect,
  onToggleSidebar,
  isSidebarHidden,
  onProfileClick,
}) => {
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
    if (onContactSelect) onContactSelect(contact);
  };

  return (
    <div className="relative bg-white border-r-2 transition-all duration-300 w-full md:w-4/12 lg:w-6/12 flex flex-col h-full">
      {/* Header */}
      <div className="lg:p-[1.04rem] p-[1.15rem] border-b-2 flex items-center justify-between gap-5">
        <button
          onClick={onToggleSidebar}
          className="p-1 border-gray-300 border-2 text-gray-400 rounded-full"
        >
          {isSidebarHidden ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
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
              className="p-4 flex items-center gap-2 cursor-pointer border-r-4 border-transparent hover:border-r-blue-600 transition-all ease-linear duration-200 border-b border-b-gray-200 hover:bg-blue-50/30"
            >
              <DropdownMenuWrapper
                className="left-0"
                triggerElement={
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                }
                menuItems={[
                  {
                    label: "Contact Info",
                    onClick: () => onProfileClick(contact),
                  },
                  { label: "Mark as read", className: "lg:hidden" },
                  { label: "Mute Notification" },
                  { label: "Delete Chat" },
                  { label: "Report" },
                  { label: "Block" },
                ]}
              />
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-bold whitespace-nowrap leading-none">
                  {contact.name}
                </h3>
                <p className="truncate whitespace-nowrap leading-none text-gray-500">
                  {truncateText(contact.lastMessage, 20)}
                </p>
              </div>
              <div className="flex ml-auto flex-col items-end justify-end">
                <span className="text-sm text-gray-400">{contact.time}</span>
                {contact.notifications > 0 && (
                  <Badge className="bg-blue-500 hover:bg-blue-500">
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
