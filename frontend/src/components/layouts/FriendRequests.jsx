import { useState, useEffect } from "react";
import { useFriendRequests } from "@/stores/useFriendRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/stores/useAuth";
import SkeletonList from "@/components/layouts/SkeletonList";
import { Toggle } from "@/components/ui/toggle";
import { UserCheck, UserMinus, UserX } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animations/Loader.json";
import { Badge } from "@/components/ui/badge"
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
    getCancelledFriendRequests,
    cancelFriendRequest,
    getReceivedFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    pendingRequests,
    cancelledRequests,
    receivedRequests,
    loading,
    pendingCount,
    cancelledCount,
    receivedCount,
  } = useFriendRequests();
  const [sentRequests, setSentRequests] = useState([]);
  const [cancelledSentRequests, setCancelledSentRequests] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false);


  useEffect(() => {
    getPendingFriendRequests();
    getCancelledFriendRequests();
    getReceivedFriendRequests();
  }, [
    getPendingFriendRequests,
    getCancelledFriendRequests,
    getReceivedFriendRequests,
  ]);

  useEffect(() => {
    if (authUser) {
      const filteredRequests = pendingRequests.filter(
        (request) => request.senderId._id === authUser._id
      );
      setSentRequests(filteredRequests);
    }
  }, [pendingRequests, authUser]);

  useEffect(() => {
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

  const handleAcceptRequest = async (requestId) => {
    await acceptFriendRequest(requestId);
    await getReceivedFriendRequests();
  };

  const handleRejectRequest = async (requestId) => {
    await rejectFriendRequest(requestId);
    await getReceivedFriendRequests();
  };


  return (
    <div className="py-2">
      <Tabs defaultValue="pending" className="">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending<Badge className="ml-1 bg-gray-500">{pendingCount}</Badge></TabsTrigger>
          <TabsTrigger value="canceled">
            Cancelled<Badge className="ml-1 bg-gray-500">{cancelledCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="recieved">Received<Badge className="ml-1 bg-gray-500">{receivedCount}</Badge></TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <div className="w-full  h-[60vh] overflow-auto py-2">
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
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <Lottie
                          className="w-6 h-6"
                          animationData={loadingAnimation}
                          loop={true}
                        />
                      ) : (
                        <UserMinus />
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
          <div className="w-full h-[60vh]  overflow-auto py-2">
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

        {/* Received Tab */}
        <TabsContent value="recieved">
          <div className="w-full h-[60vh] overflow-auto py-2">
            {loading ? (
              <SkeletonList />
            ) : receivedRequests.length === 0 ? (
              <p className="text-center text-gray-500">No received requests.</p>
            ) : (
              <ul>
                {receivedRequests.map((request) => (
                  <li
                    key={request._id}
                    className="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all ease-linear duration-200 border-b border-t py-2 px-1"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.senderId.avatar} />
                        <AvatarFallback>
                          {request.senderId.fullName
                            ? `${request.senderId.fullName.charAt(
                                0
                              )}${request.senderId.fullName
                                .split(" ")[1]
                                ?.charAt(0)}`
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.senderId.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{request.senderId.userName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        aria-label="Accept friend request"
                        size="sm"
                        className="text-white bg-green-500 hover:bg-green-600"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        <UserCheck />
                      </Toggle>
                      <Toggle
                        aria-label="Reject friend request"
                        size="sm"
                        className="text-white bg-red-500 hover:bg-red-600"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        <UserX />
                      </Toggle>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendRequests;
