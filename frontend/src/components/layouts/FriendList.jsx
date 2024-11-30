import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/utils/truncateText";
import Filter from "./Filter";
import { Contact } from "lucide-react";

const FriendList = ({ onProfileClick }) => {
  const contacts = [
    { id: 1, name: "John Doe", avatar: "https://github.com/shadcn.png", lastMessage: "Hey!", time: "12:45", notifications: 5 },
    { id: 2, name: "Jane Smith", avatar: null, lastMessage: "What's up?", time: "11:30", notifications: 3 },
    { id: 2, name: "Jane Smith", avatar: null, lastMessage: "What's up?", time: "11:30", notifications: 3 },
    // Add more contacts as needed
  ];

  const handleContactSelect = (contact) => {
    if (onProfileClick) onProfileClick(contact);
  };

  return (
    <div className="relative bg-white border-r-2 transition-all duration-300 w-full md:w-4/12 lg:w-6/12 flex flex-col h-full">
      {/* Header */}
      <div className="p-[1.12rem] border-b-2 flex items-center justify-between gap-5">
        <h2 className="font-bold whitespace-nowrap">Contact List</h2>
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
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                {contact.notifications > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 lg:hidden"
                    variant="destructive"
                  >
                    {contact.notifications}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-bold whitespace-nowrap leading-none">{contact.name}</h3>
                <p className="truncate whitespace-nowrap leading-none text-gray-500">
                  {truncateText(contact.lastMessage, 20)}
                </p>
              </div>
              <div className="flex ml-auto flex-col items-end justify-end">
                <span className="text-sm text-gray-400">{contact.time}</span>
                {contact.notifications > 0 && (
                  <Badge variant="destructive">{contact.notifications}</Badge>
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
  onProfileClick: PropTypes.func,
};

export default FriendList;
