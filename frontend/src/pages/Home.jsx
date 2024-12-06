import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import FriendList from "@/components/layouts/FriendList";
import ChatBox from "@/components/layouts/ChatBox";
import AuthorProfileInfo from "@/components/layouts/AuthorProfileInfo";
import { useAuth } from "@/stores/useAuth";

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { authUser } = useAuth();

  const handleContactListChat = (contact) => {
    setSelectedContact(contact);
    setIsChatVisible(true);
  };

  const handleChatClose = () => {
    setIsChatVisible(false);
  };

  const handleProfileInfoClick = (contact = null) => {
    const profile = contact || authUser;
    console.log("Selected Profile:", profile); // Log the correct profile data
    setSelectedProfile(profile);

    // Only toggle visibility if it's not already visible
    if (!isProfileVisible) {
      setIsProfileVisible(true);
    }
  };

  const handleProfileToggle = () => {
    if (isProfileVisible) {
      setIsProfileVisible(false);
    } else {
      setSelectedProfile(authUser); // Default to authUser when toggling
      setIsProfileVisible(true);
    }
  };

  const handleProfileClose = () => {
    setIsProfileVisible(false);
  };

  const toggleSidebar = () => {
    setIsSidebarHidden((prev) => !prev);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        isHidden={isSidebarHidden}
        toggleSidebar={toggleSidebar}
        onProfileClick={handleProfileToggle}
      />

      {/* Main Content */}
      <div className="flex-grow flex transition-all duration-300">
        {/* Friend List */}
        <FriendList
          onContactSelect={handleContactListChat}
          onToggleSidebar={toggleSidebar}
          isSidebarHidden={isSidebarHidden}
          onProfileClick={handleProfileInfoClick}
        />

        {/* Chatbox */}
        <ChatBox
          selectedContact={selectedContact}
          isVisible={isChatVisible}
          onClose={handleChatClose}
          onProfileClick={handleProfileInfoClick}
        />

        {/* Profile Info Overlay (for small/medium screens) */}
        <AuthorProfileInfo
          isVisible={isProfileVisible}
          onClose={handleProfileClose}
          selectedProfile={selectedProfile} 
        />
      </div>
    </div>
  );
};

export default Home;
