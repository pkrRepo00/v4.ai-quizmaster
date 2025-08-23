
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreDonutProps {
  percentage: number;
}

const ScoreDonut: React.FC<ScoreDonutProps> = ({ percentage }) => {
  const data = [
    { name: 'Correct', value: percentage },
    { name: 'Incorrect', value: 100 - percentage },
  ];

  const COLORS = ['#2563eb', '#e2e8f0']; // Custom: primary-600 and slate-200
  const DARK_COLORS = ['#60a5fa', '#475569']; // Custom: primary-400 and slate-600

  // This is a trick to use Tailwind colors with recharts based on theme.
  // In a real app, you might use CSS variables. Here, we check the DOM.
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const activeColors = isDarkMode ? DARK_COLORS : COLORS;

  return (
    <div className="w-40 h-40 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{percentage}%</span>
      </div>
    </div>
  );
};

export default ScoreDonut;
