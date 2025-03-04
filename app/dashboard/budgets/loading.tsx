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
      {/* Budget Form Skeleton - Matches BudgetForm.tsx layout */}
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
            <Skeleton className="h-10 w-full" /> {/* Select */}
          </div>
          <div className="mt-auto">
            <Skeleton className="h-10 w-full md:w-[120px]" /> {/* Submit Button */}
          </div>
        </div>
      </div>
      {/* Budget List Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-10 w-full md:w-[600px] mb-4" />{" "}
        {/* Search Bar */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
              <Skeleton className="h-8 w-[100px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination Skeleton - Matches Pagination.tsx layout */}
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
