import { useEffect, useState } from "react";
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
  Share,
  Share2,
} from "lucide-react";
import DropdownMenuWrapper from "@/components/layouts/DropdownMenuWrapper";
import { Button } from "@/components/ui/button";
import SkeletonList from "@/components/layouts/SkeletonList";
import { useFriendRequests } from "@/stores/useFriendRequests";
import Lottie from "lottie-react";
import InviteLoading from "@/assets/animations/InviteAnimation.json";

const FriendList = ({
  onContactSelect,
  onToggleSidebar,
  isSidebarHidden,
  onProfileClick,
}) => {
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Access the friendsList state from the store
  const { friendsList, loading, error, getFriendsList } = useFriendRequests();

  useEffect(() => {
    // Fetch the friends list when the component mounts
    getFriendsList();
  }, [getFriendsList]);

  const triggerElement = (contact) => (
    <Avatar>
      <AvatarImage src={contact?.avatar} alt={contact?.fullName} />
      <AvatarFallback>{contact?.fullName?.[0]}</AvatarFallback>
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

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.id);
    if (onContactSelect) onContactSelect(contact);
  };
  

  // Function to handle sharing the invite link
  const shareInviteLink = () => {
    const inviteLink = "https://yourapp.com/invite"; // Replace with your actual invite link
    if (navigator.share) {
      // If the Web Share API is supported, use it
      navigator
        .share({
          title: "Invite your friends!",
          url: inviteLink,
        })
        .then(() => {
          console.log("Shared successfully");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Invite link copied to clipboard! Share it with your friends.");
      });
    }
  };

  return (
    <div className="relative border-r-2 transition-all duration-300 w-full md:w-4/12 lg:w-6/12 flex flex-col h-full">
      {/* Header */}
      <div className="px-3 h-14 border-b-2 flex items-center justify-between gap-5">
        <Button
          className="rounded-full size-9 flex"
          variant="outline"
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
          {/* If loading, show skeletons inside the list */}
          {loading ? (
            [...Array(1)].map((_, index) => (
              <li
                key={index}
                className="p-4 flex items-center gap-2 cursor-pointer border-b border-b-gray-200 dark:border-b-gray-800"
              >
                <SkeletonList />
              </li>
            ))
          ) : friendsList.length === 0 ? (
            // If no friends are available, display the message and share button
            <div className="p-6 text-center text-gray-500">
              <p className="font-bold text-lg mb-4">
                No friends yet? Start by searching for new friends, or invite
                some of your own!
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={shareInviteLink} // Share invite link
              ><Share2/>
                Share Your Invite Link
              </Button>
              <Lottie
                className="size-full mt-auto"
                animationData={InviteLoading}
                loop={true}
              />
              <p className="mt-2">Or finish adding your existing friends.</p>
            </div>
          ) : (
            // If there are friends, render the list
            friendsList.map((contact) => (
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
                    {contact?.fullName} {/* Use fullName from friendsList */}
                  </h3>
                  <p className="truncate whitespace-nowrap leading-none text-gray-600 dark:text-white/50">
                    {truncateText(
                      contact?.lastMessage || "No recent message",
                      20
                    )}
                  </p>
                </div>
                <div className="flex ml-auto flex-col items-end justify-end">
                  <span className="text-sm text-gray-500 dark:text-white/40">
                    {contact?.time || "12:00"}
                  </span>
                  {contact?.notifications > 0 && (
                    <Badge className="bg-blue-500 hover:bg-blue-500 text-white">
                      {contact.notifications}
                    </Badge>
                  )}
                </div>
              </li>
            ))
          )}
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
