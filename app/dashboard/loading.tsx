import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/data-display/card";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-[180px]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Expenses Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Budget Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[200px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[260px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-[120px]" />{" "}
                  {/* Budget Overview text */}
                  <Skeleton className="h-4 w-4" /> {/* TrendingUp icon */}
                </div>
                <Skeleton className="h-4 w-[200px]" /> {/* Date range text */}
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Recent Expenses Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[150px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
