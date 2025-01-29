import { Progress } from "@radix-ui/react-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Budget } from "@/lib/data-service";

type BudgetCardProps = {
  budget: Budget;
};

function BudgetCard({ budget }: BudgetCardProps) {
  const { id, name, amount, category } = budget;

  return (
    <>
      <Card key={id}>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>${amount}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            // value={(amountSpent / amount) * 100}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>
              {/* ${expenses} */}
              spent
            </span>
            <span>
              {/* ${amount - amountSpent} */}
              remaining
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default BudgetCard;
