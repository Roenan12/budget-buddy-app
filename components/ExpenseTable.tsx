import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Placeholder data
const expenses = [
  {
    id: 1,
    name: "Groceries",
    amount: 50,
    date: "2023-06-01",
    category: "Food",
  },
  {
    id: 2,
    name: "Gas",
    amount: 30,
    date: "2023-06-02",
    category: "Transportation",
  },
  {
    id: 3,
    name: "Movie tickets",
    amount: 25,
    date: "2023-06-03",
    category: "Entertainment",
  },
  { id: 4, name: "Dinner", amount: 60, date: "2023-06-04", category: "Food" },
  {
    id: 5,
    name: "Online shopping",
    amount: 100,
    date: "2023-06-05",
    category: "Shopping",
  },
];

function ExpenseTable() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ExpenseTable;
