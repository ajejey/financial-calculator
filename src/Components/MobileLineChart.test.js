import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileLineChart from './MobileLineChart';

// Mock Recharts components
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Line: ({ name }) => <div data-testid={`line-${name}`} />,
    ReferenceLine: ({ label }) => <div data-testid={`reference-line-${label.value.toLowerCase()}`} />,
  };
});

const mockData = [
  { age: 30, savings: 10000, investments: 20000, totalWealth: 30000, loanRemaining: 5000, swpAmount: 0 },
  { age: 31, savings: 12000, investments: 25000, totalWealth: 37000, loanRemaining: 4000, swpAmount: 0 },
];

const mockFormatRupees = (value) => `₹${value}`;

describe('MobileLineChart', () => {
  test('renders correctly with data and all lines', () => {
    render(
      <MobileLineChart
        data={mockData}
        retirementAge={60}
        swpStartAge={65}
        formatRupees={mockFormatRupees}
      />
    );

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();

    expect(screen.getByTestId('line-Savings')).toBeInTheDocument();
    expect(screen.getByTestId('line-Investments')).toBeInTheDocument();
    expect(screen.getByTestId('line-Total Wealth')).toBeInTheDocument();
    expect(screen.getByTestId('line-Loan')).toBeInTheDocument(); // Name prop is "Loan"
    expect(screen.getByTestId('line-SWP')).toBeInTheDocument(); // Name prop is "SWP"

    expect(screen.getByTestId('reference-line-retire')).toBeInTheDocument();
    expect(screen.getByTestId('reference-line-swp')).toBeInTheDocument();
  });

  test('renders fallback message when no data is provided', () => {
    render(<MobileLineChart data={[]} retirementAge={60} swpStartAge={65} formatRupees={mockFormatRupees} />);
    expect(screen.getByText('No data to display for the chart.')).toBeInTheDocument();
  });

   test('renders fallback message when data is null', () => {
    render(<MobileLineChart data={null} retirementAge={60} swpStartAge={65} formatRupees={mockFormatRupees} />);
    expect(screen.getByText('No data to display for the chart.')).toBeInTheDocument();
  });

  test('renders without reference lines if props are not provided', () => {
    render(
      <MobileLineChart
        data={mockData}
        formatRupees={mockFormatRupees}
      />
    );
    expect(screen.queryByTestId('reference-line-retire')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reference-line-swp')).not.toBeInTheDocument();
  });
});
