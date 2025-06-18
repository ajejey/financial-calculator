import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FinancialPlanner from './FinancialPlanner';

// Mock child components and utils
// Ensure mocks provide named exports if the component imports them that way.

jest.mock('@/Components/ui/input', () => ({
  Input: (props) => <input data-testid={`input-${props.id}`} {...props} />,
}));
jest.mock('@/Components/ui/slider', () => ({
  Slider: (props) => <input type="range" data-testid={`slider-${props.id}`} {...props} value={props.value ? props.value[0] : 0} onChange={(e) => props.onValueChange([Number(e.target.value)])} />,
}));
jest.mock('@/Components/ui/progress', () => ({
  Progress: ({ value }) => <div data-testid="progress-bar" style={{ width: `${value}%` }} />,
}));
jest.mock('./ui/card', () => ({ // This is a relative import in FinancialPlanner.js
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 data-testid="card-title" {...props}>{children}</h3>,
  CardContent: ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>,
}));
jest.mock('@/Components/ui/tabs', () => ({
  Tabs: ({ children, ...props }) => <div data-testid="tabs" {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div data-testid="tabs-list" {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }) => <button data-testid={`tabs-trigger-${value}`} {...props}>{children}</button>,
  TabsContent: ({ children, value, ...props }) => <div data-testid={`tabs-content-${value}`} {...props}>{children}</div>,
}));
jest.mock('@/Components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
}));


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
      ReferenceLine: () => <div data-testid="reference-line" />,
    };
  });
jest.mock('@/utils/numberToWords', () => ({
  numberToWords: (num) => `${num} in words`,
}));
// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Info: () => <svg data-testid="icon-info" />,
    CalendarDays: () => <svg data-testid="icon-calendar" />,
    AlertTriangle: () => <svg data-testid="icon-alert" />,
    Landmark: () => <svg data-testid="icon-landmark" />,
    TrendingUp: () => <svg data-testid="icon-trendingup" />,
}));


describe('FinancialPlanner', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders the main component and tabs', () => {
    render(<FinancialPlanner />);
    expect(screen.getByText('Comprehensive Indian Financial Planner')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('SIP')).toBeInTheDocument();
    // ... other tabs
  });

  test('renders Retirement Readiness section correctly', () => {
    render(<FinancialPlanner />);
    fireEvent.click(screen.getByText('Retirement')); // Navigate to Retirement tab

    expect(screen.getByText('Retirement Readiness')).toBeInTheDocument();
    expect(screen.getByTestId('icon-info')).toBeInTheDocument();

    // Check for progress bar section
    expect(screen.getByText('Projected Retirement Corpus')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();

    // Check for StatCards (identified by their titles or unique icons)
    expect(screen.getByText('Years of Sustainability')).toBeInTheDocument();
    expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();

    expect(screen.getByText('Monthly Shortfall')).toBeInTheDocument();
    // The icon for Monthly Shortfall (AlertTriangle or Landmark) depends on the value,
    // which might be 0 initially. Test for at least one of them or the title itself.
  });

  test('StatCard renders correctly with props', () => {
    // This is effectively testing the StatCard component used within FinancialPlanner
    render(<FinancialPlanner />); // Render the parent to access StatCard context
    fireEvent.click(screen.getByText('Retirement')); // Navigate to Retirement tab

    // Example: Test the "Years of Sustainability" StatCard
    // These texts are part of the StatCard's output based on retirementStats
    // We rely on the initial state of retirementStats for these values.
    // A more isolated test for StatCard itself would be beneficial too.
    const yearsStatCardTitle = screen.getByText('Years of Sustainability');
    expect(yearsStatCardTitle).toBeInTheDocument();
    // Check for its value (e.g., "X years")
    // This requires knowing the initial state. For example, if it's "30 years":
    expect(screen.getByText(/years/i, { selector: '.text-2xl.font-bold' })).toBeInTheDocument();
    expect(screen.getByText('How long your corpus might last.')).toBeInTheDocument(); // Description
  });

  test('input changes update state and trigger recalculations (conceptual)', () => {
    render(<FinancialPlanner />);
    fireEvent.click(screen.getByText('General')); // Ensure General tab is active

    const incomeInput = screen.getByTestId('input-monthlyIncome');
    fireEvent.change(incomeInput, { target: { value: '60000' } });
    expect(incomeInput.value).toBe('60000');
    // Check if numberToWords updated (it's part of the renderInput helper)
    expect(screen.getByText('₹ 60000 in words')).toBeInTheDocument();

    // Further tests would involve checking if the chart data or retirement stats changed.
    // This requires mocking calculation functions or observing their side effects.
    // For example, if retirementStats.projectedCorpus changes, its display should update.
    // This is complex because useEffect handles the recalculation.
    // A simple check could be to see if the progress bar value changes after an input that affects it.
  });

  test('numberToWords text color is text-muted-foreground', () => {
    render(<FinancialPlanner />);
    fireEvent.click(screen.getByTestId('tabs-trigger-general')); // Use testId for tab trigger
    const generalTabContent = screen.getByTestId('tabs-content-general');
    // Query within the general tab content
    const numberToWordsElement = within(generalTabContent).getByText('₹ 50000 in words');
    expect(numberToWordsElement).toHaveClass('text-muted-foreground');
  });
});

// Helper to use 'within' query properly
import { within } from '@testing-library/dom';
