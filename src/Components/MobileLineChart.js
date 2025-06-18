"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const MobileLineChart = ({ data, retirementAge, swpStartAge, formatRupees }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center border border-dashed mt-4">
        <p>No data to display for the chart.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
        <XAxis
          dataKey="age"
          label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          tickCount={5} // Adjusted for mobile
        />
        <YAxis
          tickFormatter={(value) => `₹${value / 100000}L`}
          label={{ value: 'Amount (Lakhs)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 10 }}
          tick={{ fontSize: 10 }}
          tickCount={5} // Adjusted for mobile
        />
        <Tooltip
          formatter={(value, name) => [`${formatRupees ? formatRupees(value) : value}`, name]}
          labelStyle={{ fontSize: 12 }}
          itemStyle={{ fontSize: 10 }}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '5px' }} // Simplified tooltip
        />
        <Legend wrapperStyle={{ fontSize: "10px" }} />
        <Line type="monotone" dataKey="savings" stroke="#8884d8" name="Savings" dot={false} strokeWidth={1.5} />
        <Line type="monotone" dataKey="investments" stroke="#82ca9d" name="Investments" dot={false} strokeWidth={1.5} />
        <Line type="monotone" dataKey="totalWealth" stroke="#ffc658" name="Total Wealth" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="loanRemaining" stroke="#ff8042" name="Loan" dot={false} strokeWidth={1.5} />
        <Line type="monotone" dataKey="swpAmount" stroke="#e74c3c" name="SWP" dot={false} strokeWidth={1.5} />

        {retirementAge && <ReferenceLine x={retirementAge} stroke="red" strokeDasharray="2 2" label={{ value: "Retire", fontSize: 8, position: 'insideTopRight', fill: 'red' }} />}
        {swpStartAge && <ReferenceLine x={swpStartAge} stroke="green" strokeDasharray="2 2" label={{ value: "SWP", fontSize: 8, position: 'insideTopRight', fill: 'green' }} />}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MobileLineChart;
