import { Skeleton } from "@/components/ui/skeleton";

const SkeletonList = () => (
  <>
    {Array(1)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-l w-full"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <Skeleton className="size-5 p-3" />
        </div>
      ))}
  </>
);

export default SkeletonList;
