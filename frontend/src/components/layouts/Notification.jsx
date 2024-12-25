// import { useEffect } from "react";
// import { BellIcon, BellRing, Check } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { useNotification } from "@/stores/useNotification";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/hooks/use-toast";

// const Notification = () => {
//   const { notifications, isLoading, error, fetchNotifications, markAllAsRead } =
//     useNotification();

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   if (isLoading) {
//     return (
//       <Skeleton className="size-5"/>
//     );
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <Dialog>
//         <DialogTrigger className="flex relative lex items-center text-gray-700 hover:text-blue-600 font-bold transition-all ease-linear duration-200">
//           <BellIcon className="size-5" />
//           {/* Only show badge if there are notifications */}
//           {notifications.length > 0 && (
//             <Badge className="absolute top-0 right-[2px] px-[3px] size-2 bg-blue-500 hover:bg-blue-500 transition-all ease-linear duration-200"></Badge>
//           )}
//         </DialogTrigger>
//         <DialogContent className="">
//           <DialogHeader>
//             <DialogTitle>Notifications</DialogTitle>
//             <DialogDescription>
//               You have {notifications.length} unread messages.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex items-center space-x-4 rounded-md border p-4">
//             <BellRing />
//             <div className="flex-1 space-y-1">
//               <p className="text-sm font-medium leading-none">
//                 Push Notifications
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 Send notifications to device.
//               </p>
//             </div>
//             <Switch />
//           </div>

//           <ul className="pb-5">
//             {notifications.length === 0 ? (
//               <p>No new notifications</p>
//             ) : (
//               notifications.map((notification, index) => (
//                 <li
//                   key={index}
//                   className="flex items-center gap-3 py-2 border-t border-b hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all ease-linear duration-200"
//                 >
//                   <Avatar>
//                     {notification.avatar ? (
//                       <AvatarImage src={notification.avatar} />
//                     ) : (
//                       <AvatarFallback>
//                         {notification.fullName
//                           ? `${notification.fullName.charAt(0)}${
//                               notification.fullName.split(" ")[1]?.charAt(0)
//                             }`
//                           : "?"}
//                       </AvatarFallback>
//                     )}
//                   </Avatar>
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {notification.message}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(notification.createdAt).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </li>
//               ))
//             )}
//           </ul>

//           <DialogFooter>
//             <Button className="w-full" onClick={markAllAsRead}>
//               <Check /> Mark all as read
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Notification;


import { useEffect } from "react";
import { BellIcon, BellRing, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/stores/useNotification";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/stores/useAuth";
import socket from "@/lib/socket";

const Notification = () => {
  const { authUser } = useAuth(); // Get the authenticated user from the useAuth store
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAllAsRead,
    subscribeToNotifications,
  } = useNotification();

  const { toast } = useToast();

  useEffect(() => {
    if (authUser) {
      // Fetch existing notifications
      fetchNotifications();

      // Subscribe to notifications using the authenticated user's ID
      subscribeToNotifications(authUser._id);

      // Listen for notifications and show toast
      const handleNotification = (notification) => {
        toast({
          title: "New Notification",
          description: notification.message,
          status: "info",
        });
      };
      socket.on("notification", handleNotification);

      // Cleanup the WebSocket on component unmount
      return () => {
        socket.off("notification", handleNotification);
      };
    }
  }, [authUser, fetchNotifications, subscribeToNotifications, toast]);

  if (isLoading) {
    return <Skeleton className="size-5" />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex relative items-center text-gray-700 hover:text-blue-600 font-bold transition-all ease-linear duration-200">
          <BellIcon className="size-5" />
          {notifications.length > 0 && (
            <Badge className="absolute top-0 right-[2px] px-[3px] size-2 bg-blue-500 hover:bg-blue-500 transition-all ease-linear duration-200"></Badge>
          )}
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              You have {notifications.length} unread messages.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Send notifications to device.</p>
            </div>
            <Switch />
          </div>

          <ul className="pb-5">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 py-2 border-t border-b hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all ease-linear duration-200"
                >
                  <Avatar>
                    {notification.avatar ? (
                      <AvatarImage src={notification.avatar} />
                    ) : (
                      <AvatarFallback>
                        {notification.fullName
                          ? `${notification.fullName.charAt(0)}${notification.fullName.split(" ")[1]?.charAt(0)}`
                          : "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">{new Date(notification.createdAt).toLocaleTimeString()}</p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <DialogFooter>
            <Button className="w-full" onClick={markAllAsRead}>
              <Check /> Mark all as read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notification;
