import { Skeleton } from "@/components/ui/skeleton";

const ChatSkeleton = () => (
  <>
    {Array(5)
      .fill(0)
      .map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-lg" />
      ))}
  </>
);

export default ChatSkeleton;
