import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseChart } from './ExpenseChart';
import { MonthlyChart } from './MonthlyChart';
import { ExpenseList } from './ExpenseList';
import { CategoryManager } from './CategoryManager';
import { useExpenseStore } from '../hooks/useExpenseStore';

export const Dashboard = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const { expenses, income, getMonthlyTotal, getCategoryTotals, getCurrentMonthExpenses } = useExpenseStore();

  const currentMonthExpenses = getCurrentMonthExpenses();
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = income;
  const remaining = monthlyIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cost Tracker</h1>
            <p className="text-muted-foreground">Manage your expenses locally</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCategoryManager(true)}
              variant="outline"
              className="hidden sm:flex"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Categories
            </Button>
            <Button 
              onClick={() => setShowExpenseForm(true)}
              className="bg-primary hover:bg-primary-hover transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${monthlyIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <DollarSign className={`h-4 w-4 ${remaining >= 0 ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${remaining.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseList />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
      
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  );
};