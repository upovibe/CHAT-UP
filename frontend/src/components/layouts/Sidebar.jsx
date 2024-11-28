import PropTypes from "prop-types";
import { Ban, Edit, MessagesSquare, MessageSquareDotIcon, SidebarClose, SidebarOpen, Users, Rss } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/useAuth";
import { Badge } from "../ui/badge";

const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
  const { authUser } = useAuth();

  return (
    <div
      className={`transition-all duration-300 p-0 border-r-2 ${
        isSidebarExpanded ? "w-full" : "w-0 md:w-4/12 lg:w-3/12 xl:w-2/12"
      }`}
    >
      <div
        className={`flex flex-col ${
          isSidebarExpanded ? "block" : "hidden md:block"
        }`}
      >
        <div className="p-4 border-b-2 flex items-center justify-between">
          <h2 className="md:text-lg font-bold whitespace-nowrap">Panel</h2>
          <Edit className="size-5 text-gray-500" />
        </div>
        {/* Navigation Options */}
        <ul className="space-y-3 mt-4">
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
              <Avatar className="size-7 object-cover ">
                <AvatarImage
                  src={authUser?.Avatar || "https://via.placeholder.com/150"}
                />
                <AvatarFallback>
                  {authUser?.fullName
                    ? `${authUser.fullName.charAt(0)}${authUser.fullName
                        .split(" ")[1]
                        ?.charAt(0)}`
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">Inbox</h3>
                <Badge variant="destructive">5</Badge>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">5</span>
          </li>
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
                    <Users className="text-gray-400"/>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">All</h3>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">7</span>
          </li>
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
                    <MessageSquareDotIcon className="text-gray-400"/>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">Live Chat</h3>
                <Badge variant="destructive">15</Badge>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">7</span>
          </li>
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
                    <MessagesSquare className="text-gray-400"/>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">Groups</h3>
                <Badge variant="destructive">5</Badge>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">11</span>
          </li>          
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
                    <Rss className="text-gray-400"/>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">Channels</h3>
                <Badge variant="destructive">2</Badge>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">2</span>
          </li>
          <li className="px-4 py-2 flex itesm-center justify-between cursor-pointer hover:text-blue-500 border-l-4 border-transparent hover:border-blue-600 hover:bg-blue-100/50 transition-all ease-linear duration-200 mr-2 rounded-r-full">
            <div className="flex items-center gap-3">
                    <Ban className="text-gray-400"/>
              <div className="flex items-center gap-1">
                <h3 className="font-bold whitespace-nowrap">Blocked</h3>
              </div>
            </div>
            <span className="text-gray-400 font-bold whitespace-nowrap">2</span>
          </li>
        </ul>
      </div>

      {/* Toggle Button for Sidebar (Visible only on small screens) */}
      <button
        onClick={toggleSidebar}
        className="absolute bottom-0 left-0 z-30 p-1 m-2 border-gray-300 border-2 text-gray-400 rounded-full md:hidden"
      >
        {isSidebarExpanded ? (
          <SidebarClose className="size-4" />
        ) : (
          <SidebarOpen className="size-4" />
        )}
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;




// import PropTypes from "prop-types";
// import {
//   Ban,
//   Edit,
//   MessagesSquare,
//   MessageSquareDotIcon,
//   SidebarClose,
//   SidebarOpen,
//   Users,
//   Rss,
// } from "lucide-react";
// import { useAuth } from "@/store/useAuth";
// import ListItem from "@/components/ui/ListItem"

// const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
//   const { authUser } = useAuth();

//   return (
//     <div
//       className={`transition-all duration-300 p-0 border-r-2 ${
//         isSidebarExpanded ? "w-fit" : "w-0 lg:w-2/12"
//       }`}
//     >
//       <div
//         className={`flex flex-col ${
//           isSidebarExpanded ? "block" : "hidden md:block"
//         }`}
//       >
//         <div className="p-4 border-b-2 flex items-center justify-between">
//           <h2 className="md:text-lg font-bold whitespace-nowrap">Panel</h2>
//           <Edit className="size-5 text-gray-500" />
//         </div>
//         {/* Navigation Options */}
//         <ul className="space-y-3 mt-4">
//           <ListItem
//             icon={null}
//             title="Inbox"
//             badgeCount={5}
//             authUser={authUser}
//             avatar={true}
//             link="5"
//           />
//           <ListItem
//             icon={Users}
//             title="All"
//             badgeCount={7}
//             authUser={null}
//             avatar={false}
//             link="7"
//           />
//           <ListItem
//             icon={MessageSquareDotIcon}
//             title="Live Chat"
//             badgeCount={13}
//             authUser={null}
//             avatar={false}
//             link="7"
//           />
//           <ListItem
//             icon={MessagesSquare}
//             title="Groups"
//             badgeCount={5}
//             authUser={null}
//             avatar={false}
//             link="11"
//           />
//           <ListItem
//             icon={Rss}
//             title="Channels"
//             badgeCount={2}
//             authUser={null}
//             avatar={false}
//             link="2"
//           />
//           <ListItem
//             icon={Ban}
//             title="Blocked"
//             badgeCount={0}
//             authUser={null}
//             avatar={false}
//             link="2"
//           />
//         </ul>
//       </div>

//       {/* Toggle Button for Sidebar (Visible only on small screens) */}
//       <button
//         onClick={toggleSidebar}
//         className="absolute bottom-0 left-0 z-30 p-1 m-2 border-gray-300 border-2 text-gray-400 rounded-full lg:hidden"
//       >
//         {isSidebarExpanded ? (
//           <SidebarClose className="size-4" />
//         ) : (
//           <SidebarOpen className="size-4" />
//         )}
//       </button>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   isSidebarExpanded: PropTypes.bool.isRequired,
//   toggleSidebar: PropTypes.func.isRequired,
// };

// export default Sidebar;
