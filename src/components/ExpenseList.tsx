import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { useExpenseStore } from '../hooks/useExpenseStore';
import { ExpenseForm } from './ExpenseForm';
import { toast } from '@/hooks/use-toast';

export const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [editingExpense, setEditingExpense] = useState(null);

  const recentExpenses = expenses.slice(0, 10);

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Success",
      description: "Expense deleted successfully",
    });
  };

  if (recentExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No expenses yet. Add your first expense to get started!
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {expense.description || 'No description'}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </>
  );
};