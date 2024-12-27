import { useEffect } from "react";
import { BellIcon, BellRing, Check, Trash } from "lucide-react";
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

const Notification = () => {
  const { authUser } = useAuth();
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAllAsRead,
    clearAllNotifications,
    clearNotification,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = useNotification();
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
      subscribeToNotifications(authUser._id);
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [authUser, fetchNotifications, subscribeToNotifications, unsubscribeFromNotifications]);


  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "Marked all as read",
      description: "All notifications are now marked as read.",
    });
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  const handleClearNotification = (notificationId, message) => {
    clearNotification(notificationId);
    toast({
      title: "Notification cleared",
      description: (
        <div>
           Notification: <strong>{message}</strong> has been removed.
        </div>
      ),
    });
  };
  

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
          {unreadCount > 0 && (
            <Badge className="absolute top-0 right-[2px] px-[3px] size-2 bg-blue-500 hover:bg-blue-500 transition-all ease-linear duration-200">
              {unreadCount}
            </Badge>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              You have {unreadCount} unread notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Send notifications to your device.
              </p>
            </div>
            <Switch />
          </div>

          <ul className="pb-5">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`flex items-center justify-between gap-3 py-2 border-t border-b px-2 ${
                    notification.read
                      ? "bg-gray-100"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800"
                  } cursor-pointer transition-all ease-linear duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {notification.avatar ? (
                        <AvatarImage src={notification.avatar} />
                      ) : (
                        <AvatarFallback>
                          {notification.fullName
                            ? `${notification.fullName.charAt(
                                0
                              )}${notification.fullName.split(" ")[1]?.charAt(
                                0
                              )}`
                            : "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleClearNotification(notification._id, notification.message)
                    }
                  >
                    <Trash size={16} />
                  </Button>
                </li>
              ))
            )}
          </ul>

          <DialogFooter className="flex flex-col gap-2  justify-between">
            <Button className="flex-1 w-full" onClick={handleMarkAllAsRead}>
              <Check className="mr-1" /> Mark all as read
            </Button>
            <Button
              variant="destructive"
              className="flex-1 w-full"
              onClick={handleClearAllNotifications}
            >
              <Trash className="mr-1" /> Clear all notifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notification;

