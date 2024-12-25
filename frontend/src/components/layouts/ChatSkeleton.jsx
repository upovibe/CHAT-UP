import { Skeleton } from "@/components/ui/skeleton";

const ChatSkeleton = () => (
  <>
    {Array(5)
      .fill(0)
      .map((_, index) => (
        <Skeleton key={index} className="h-16 max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[500px] rounded-lg" />
      ))}
  </>
);

export default ChatSkeleton;
