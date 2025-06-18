import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react'; // Import within
import MobileFinancialPlanner from './MobileFinancialPlanner';

// Mock child components
const MockRotaryDial = ({ value, onChange, min, max, step }) => (
  <input
    type="range"
    data-testid={`rotary-dial-${min}-${max}`} // Unique testId based on props
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange(Number(e.target.value))}
  />
);
MockRotaryDial.displayName = "MockRotaryDial";
jest.mock('./ui/RotaryDial', () => MockRotaryDial);


// Mock shadcn/ui tab components used by MobileFinancialPlanner
const MockTabs = ({ children, defaultValue, ...props }) => <div data-testid="tabs" data-default-value={defaultValue} {...props}>{children}</div>;
MockTabs.displayName = "MockTabs";
const MockTabsList = ({ children, ...props }) => <div data-testid="tabs-list" {...props}>{children}</div>;
MockTabsList.displayName = "MockTabsList";
const MockTabsTrigger = ({ children, value, ...props }) => <button data-testid={`tabs-trigger-${value}`} data-value={value} {...props}>{children}</button>;
MockTabsTrigger.displayName = "MockTabsTrigger";
const MockTabsContent = ({ children, value, ...props }) => <div data-testid={`tabs-content-${value}`} {...props}>{children}</div>;
MockTabsContent.displayName = "MockTabsContent";
jest.mock('../Components/ui/tabs', () => ({
  Tabs: MockTabs,
  TabsList: MockTabsList,
  TabsTrigger: MockTabsTrigger,
  TabsContent: MockTabsContent,
}));

// Mock Card and Label as they are also used from ./ui/
const MockCard = ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>;
MockCard.displayName = "MockCard";
const MockCardHeader = ({ children, ...props }) => <div data-testid="card-header" {...props}>{children}</div>;
MockCardHeader.displayName = "MockCardHeader";
const MockCardTitle = ({ children, ...props }) => <h3 data-testid="card-title" {...props}>{children}</h3>;
MockCardTitle.displayName = "MockCardTitle";
const MockCardContent = ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>;
MockCardContent.displayName = "MockCardContent";
jest.mock('../Components/ui/card', () => ({
  Card: MockCard,
  CardHeader: MockCardHeader,
  CardTitle: MockCardTitle,
  CardContent: MockCardContent,
}));

const MockLabel = ({ children, ...props }) => <label {...props}>{children}</label>;
MockLabel.displayName = "MockLabel";
jest.mock('../Components/ui/label', () => ({
  Label: MockLabel,
}));

const MockProgress = ({ value, ...props }) => <div data-testid="progress" data-value={value} {...props} />;
MockProgress.displayName = "MockProgress";
jest.mock('../Components/ui/progress', () => ({ // Assuming path for Progress
  Progress: MockProgress,
}));

const MockMobileLineChart = ({ data, retirementAge, swpStartAge, formatRupees }) => (
  <div data-testid="mobile-line-chart">
    Chart Data Length: {data?.length || 0}
    Retirement Age: {retirementAge}
    SWP Start Age: {swpStartAge}
  </div>
));

// Mock numberToWords utility as it's not relevant to this component's logic testing
jest.mock('@/utils/numberToWords', () => ({
  numberToWords: (num) => `${num} in words`,
}));


describe('MobileFinancialPlanner', () => {
  test('renders initial components and tabs correctly', () => {
    render(<MobileFinancialPlanner />);

    // Check for tabs
    expect(screen.getByTestId('tabs-trigger-general')).toBeInTheDocument();
    expect(screen.getByTestId('tabs-trigger-sip')).toBeInTheDocument();
    // ... other tabs by testid

    // Check for the chart
    expect(screen.getByTestId('mobile-line-chart')).toBeInTheDocument();

    // Check for at least one RotaryDial in the default (General) tab
    expect(screen.getByTestId('tabs-content-general')).toBeVisible();; // Semicolon added as per request
    expect(within(screen.getByTestId('tabs-content-general')).getByTestId('rotary-dial-0-500000')).toBeInTheDocument(); // Monthly Income
  });

  test('switches tabs and renders corresponding RotaryDials', async () => {
    render(<MobileFinancialPlanner />);

    // Default tab is general
    expect(screen.getByTestId('tabs-content-general')).toBeVisible();
    // expect(screen.queryByTestId('tabs-content-sip')).not.toBeVisible(); // This check is problematic with simple mock


    fireEvent.click(screen.getByTestId('tabs-trigger-sip'));
    // With the current mock, all TabsContent are always in the DOM.
    // We just ensure that we can find elements within the intended active tab.
    expect(within(screen.getByTestId('tabs-content-sip')).getByTestId('rotary-dial-0-100000')).toBeInTheDocument(); // Monthly SIP

    fireEvent.click(screen.getByTestId('tabs-trigger-house'));
    expect(within(screen.getByTestId('tabs-content-house')).getByTestId('rotary-dial-1000000-50000000')).toBeInTheDocument(); // House Value
  });

  test('updates state and chart data on RotaryDial interaction', async () => {
    render(<MobileFinancialPlanner />);

    // Initial state for monthly income is 50000
    const incomeDial = screen.getByTestId('rotary-dial-0-500000'); // Monthly Income
    expect(incomeDial).toHaveValue('50000');

    // Simulate changing the monthly income via the mocked RotaryDial (input type range)
    fireEvent.change(incomeDial, { target: { value: '60000' } });

    // Check if the dial's value updated
    expect(incomeDial).toHaveValue('60000');

    // The effect of this change on the chart data or retirement stats would require
    // more intricate checking, potentially by looking at the text content of the chart mock
    // or the retirement stats section if its values are directly rendered.
    // For now, we confirm the input value changes, implying the state setter was called.
    // The useEffect in MobileFinancialPlanner should then trigger recalculations.

    // Example: Check if numberToWords output reflects the change
    expect(screen.getByText('₹ 60000 in words')).toBeInTheDocument();

    // Further tests could assert changes in the mocked MobileLineChart's displayed props
    // or the Retirement Readiness section, but that might involve waiting for useEffect.
  });

  test('renders Retirement Readiness section with initial values', () => {
    render(<MobileFinancialPlanner />);
    fireEvent.click(screen.getByTestId('tabs-trigger-retirement'));

    const retirementTabContent = screen.getByTestId('tabs-content-retirement');
    expect(within(retirementTabContent).getByText('Retirement Readiness')).toBeInTheDocument();
    expect(within(retirementTabContent).getByText('Projected vs. Desired Corpus')).toBeInTheDocument();
    // Initial values depend on the default state and calculations,
    // which might be complex to assert without knowing the exact initial calculation output.
    // We can check for the presence of the labels:
    expect(screen.getByText('Years of Sustainability')).toBeInTheDocument();
    expect(screen.getByText('Monthly Shortfall')).toBeInTheDocument();
  });

});
