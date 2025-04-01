"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/form/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { Button } from "@/components/ui/buttons/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { updateUserCurrencyAction } from "@/lib/actions";
import { toast } from "@/hooks/useToast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";

export function UpdateCurrencyForm() {
  const { currency, setCurrency, currencies, isLoading } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [isPending, setIsPending] = useState(false);

  // Reset the selected currency when the context currency changes
  useEffect(() => {
    if (!isPending) {
      setSelectedCurrency(currency);
    }
  }, [currency, isPending]);

  const handleSave = async () => {
    if (selectedCurrency === currency) {
      // No changes made
      toast({
        title: "No Changes",
        description: "You haven't made any changes to your currency settings.",
      });
      return;
    }

    try {
      setIsPending(true);
      const result = await updateUserCurrencyAction(selectedCurrency);

      if (result.success) {
        setCurrency(selectedCurrency);
        toast({
          title: "Settings Updated",
          description:
            "Your currency preference has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update currency:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    // Reset to the original currency from context
    setSelectedCurrency(currency);
  };

  return (
    <Card className="p-4 max-w-[500px]">
      <CardHeader>
        <CardTitle>Currency Preference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled={isLoading || isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-2">
                Loading your settings...
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={selectedCurrency === currency || isLoading || isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedCurrency === currency || isLoading || isPending}
              className="ml-2"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
