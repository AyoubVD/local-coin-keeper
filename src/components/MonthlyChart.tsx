import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenseStore } from '../hooks/useExpenseStore';

export const MonthlyChart = () => {
  const { getMonthlyTotal } = useExpenseStore();
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const data = monthNames.map((month, index) => ({
    month,
    expenses: getMonthlyTotal(index, currentYear),
  }));

  const maxExpense = Math.max(...data.map(d => d.expenses));

  if (maxExpense === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Expenses']} />
        <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};