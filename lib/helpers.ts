// Formatting percentages
export const formatPercentage = (amt: number): string => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Formatting currency (USD)
export const formatCurrency = (amt: number): string => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
