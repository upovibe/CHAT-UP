import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import FriendList from "@/components/layouts/FriendList";
import ChatBox from "@/components/layouts/ChatBox";
import RecipientInfo from "@/components/layouts/RecipientInfo";
const Home = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isRecipientInfoVisible, setIsRecipientInfoVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const showRecipientInfo = () => {
    setIsRecipientInfoVisible(true);
  };

  const hideRecipientInfo = () => {
    setIsRecipientInfoVisible(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-grow flex transition-all duration-300">
        {/* Friend List */}
        <FriendList isSidebarExpanded={isSidebarExpanded} onProfileClick={showRecipientInfo} />

        {/* Chatbox */}
        <ChatBox isSidebarExpanded={isSidebarExpanded} />

        {/* Recipient Info - Visible on Small and Medium as Overlay, and Normal on Large */}
        <RecipientInfo
          isVisible={isRecipientInfoVisible}
          onClose={hideRecipientInfo}
        />
      </div>
    </div>
  );
};

export default Home;