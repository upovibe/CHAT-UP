import { useState, useEffect } from "react";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/stores/useAuth";
import SkeletonList from "@/components/layouts/SkeletonList";
import { Toggle } from "@/components/ui/toggle";
import { UserX } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animations/Loader.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FriendRequests = () => {
  const { authUser } = useAuth();
  const {
    getPendingFriendRequests,
    cancelFriendRequest,
    getCancelledFriendRequests,
    pendingRequests,
    cancelledRequests,
    loading,
  } = useFriendRequests();
  const [sentRequests, setSentRequests] = useState([]);
  const [cancelledSentRequests, setCancelledSentRequests] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false); // Add this state

  useEffect(() => {
    // Fetch pending and cancelled friend requests on component mount
    getPendingFriendRequests();
    getCancelledFriendRequests();
  }, [getPendingFriendRequests, getCancelledFriendRequests]);

  useEffect(() => {
    // Filter requests where the logged-in user is the sender for pending requests
    if (authUser) {
      const filteredRequests = pendingRequests.filter(
        (request) => request.senderId._id === authUser._id
      );
      setSentRequests(filteredRequests);
    }
  }, [pendingRequests, authUser]);

  useEffect(() => {
    // Filter requests where the logged-in user is the sender for cancelled requests
    if (authUser) {
      const filteredRequests = cancelledRequests.filter(
        (request) => request.senderId._id === authUser._id
      );
      setCancelledSentRequests(filteredRequests);
    }
  }, [cancelledRequests, authUser]);

  const handleCancelRequest = async (receiverId) => {
    setCancelLoading(true);
    await cancelFriendRequest(receiverId);
    await getPendingFriendRequests();
    setCancelLoading(false);
  };

  return (
    <div className="py-2">
      <Tabs defaultValue="pending" className="">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="canceled">Cancelled</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <div className="w-full h-[86vh] md:h-[70vh] lg:h-[60vh] overflow-auto py-2">
            {loading ? (
              <SkeletonList />
            ) : sentRequests.length === 0 ? (
              <p className="text-center text-gray-500">
                No pending requests sent.
              </p>
            ) : (
              <ul className="flex flex-col">
                {sentRequests.map((request) => (
                  <li
                    key={request._id}
                    className="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all ease-linear duration-200 border-b border-t py-2 px-1"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.receiverId.avatar} />
                        <AvatarFallback>
                          {request.receiverId.fullName
                            ? `${request.receiverId.fullName.charAt(
                                0
                              )}${request.receiverId.fullName
                                .split(" ")[1]
                                ?.charAt(0)}`
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.receiverId.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{request.receiverId.userName}
                        </div>
                      </div>
                    </div>
                    <Toggle
                      aria-label="Cancel friend request"
                      size="sm"
                      className="text-white bg-red-500"
                      onClick={() =>
                        handleCancelRequest(request.receiverId._id)
                      }
                      disabled={cancelLoading} // Disable while loading
                    >
                      {cancelLoading ? (
                        <Lottie
                          className="w-6 h-6"
                          animationData={loadingAnimation}
                          loop={true}
                        />
                      ) : (
                        <UserX />
                      )}
                    </Toggle>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        {/* Cancelled Tab */}
        <TabsContent value="canceled">
          <div className="w-full h-[86vh] md:h-[70vh] lg:h-[60vh] overflow-auto py-2">
            {loading ? (
              <SkeletonList />
            ) : cancelledSentRequests.length === 0 ? (
              <p className="text-center text-gray-500">
                No cancelled requests sent.
              </p>
            ) : (
              <ul>
                {cancelledSentRequests.map((request) => (
                  <li
                    key={request._id}
                    className="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all ease-linear duration-200 border-b border-t py-2 px-1"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.receiverId.avatar} />
                        <AvatarFallback>
                          {request.receiverId.fullName
                            ? `${request.receiverId.fullName.charAt(
                                0
                              )}${request.receiverId.fullName
                                .split(" ")[1]
                                ?.charAt(0)}`
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.receiverId.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{request.receiverId.userName}
                        </div>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Toggle
                            aria-label="Canceled request"
                            size="sm"
                            className="text-white cursor-not-allowed"
                          >
                            <UserX />
                          </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cannot send requet after 14 days</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        {/* Accepted Tab */}
        <TabsContent value="accepted">Accepted</TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendRequests;
