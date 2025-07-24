import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useExpenseStore } from '../hooks/useExpenseStore';

export const ExpenseChart = () => {
  const { categories, getCategoryTotals } = useExpenseStore();
  const categoryTotals = getCategoryTotals();

  const data = categories
    .map(category => ({
      name: category.name,
      value: categoryTotals[category.name] || 0,
      color: category.color,
    }))
    .filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No expenses to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};