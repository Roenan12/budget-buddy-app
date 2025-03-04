import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/data-display/card";

export default function Loading() {
  return (
    <div className="w-full p-4">
      <Skeleton className="h-8 w-[120px] mb-4" /> {/* Title */}
      {/* Expense Form Skeleton */}
      <div className="mb-8">
        <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
          <div className="flex-1">
            <Skeleton className="h-4 w-[80px] mb-2" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-[80px] mb-2" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-[80px] mb-2" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Date Input */}
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-[80px] mb-2" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Budget Select */}
          </div>
          <div className="mt-auto">
            <Skeleton className="h-10 w-full md:w-[120px]" />{" "}
            {/* Submit Button */}
          </div>
        </div>
      </div>
      {/* Expense Table Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-10 w-full md:w-[600px] mb-4" />{" "}
        {/* Search Bar */}
      </div>
      {/* Table Header Skeleton */}
      <Card className="mb-4">
        <div className="border-b">
          <div className="grid grid-cols-5 p-4">
            <Skeleton className="h-4 w-[100px]" /> {/* Name */}
            <Skeleton className="h-4 w-[80px]" /> {/* Amount */}
            <Skeleton className="h-4 w-[100px]" /> {/* Date */}
            <Skeleton className="h-4 w-[100px]" /> {/* Budget */}
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 p-4 items-center">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          ))}
        </div>
      </Card>
      {/* Pagination Skeleton */}
      <div className="flex flex-col gap-0">
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Skeleton className="h-5 w-[200px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Skeleton className="h-5 w-[120px] mr-2" />
            <Skeleton className="h-10 w-[60px]" />
          </div>
          <Skeleton className="h-5 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
