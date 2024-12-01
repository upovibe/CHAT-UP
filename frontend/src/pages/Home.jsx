import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import FriendList from "@/components/layouts/FriendList";
import ChatBox from "@/components/layouts/ChatBox";
import AuthorInfo from "@/components/layouts/AuthorInfo";

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const handleContactListChat = (contact) => {
    setSelectedContact(contact);
    setIsChatVisible(true);
  };

  const handleChatClose = () => {
    setIsChatVisible(false);
  };

  const handleProfileInfoClick = () => {
    setIsProfileVisible(true);
  };
  
  const handleProfileClose = () => {
    setIsProfileVisible(false);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex transition-all duration-300">

        {/* Friend List */}
        <FriendList onProfileClick={handleContactListChat} />

        {/* Chatbox */}
        <ChatBox
          selectedContact={selectedContact}
          isVisible={isChatVisible}
          onClose={handleChatClose}
          onProfileClick={handleProfileInfoClick} 
        />

        {/* Profile Info Overlay (for small/medium screens) */}
        <AuthorInfo isVisible={isProfileVisible} onClose={handleProfileClose} />
      </div>
    </div>
  );
};

export default Home;
