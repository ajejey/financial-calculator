"use client"
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // This path is correct as card.jsx is in ./ui/
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'; // Corrected path to uppercase C
import { Label } from '@/Components/ui/label';   // Corrected path to uppercase C
import { Input } from '@/Components/ui/input';   // Corrected path to uppercase C
import { Slider } from '@/Components/ui/slider'; // Corrected path to uppercase C
import { Progress } from '@/Components/ui/progress'; // Corrected path to uppercase C
import { DollarSign, CalendarDays, Landmark, TrendingUp, AlertTriangle, Info } from 'lucide-react'; // Added icons
import { numberToWords } from '@/utils/numberToWords';

const StatCard = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

// Helper for input fields - defined globally in the module
const renderInput = (id, label, value, setter, unit, isWords = false) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => setter(Number(e.target.value))}
      className="w-full"
    />
    {isWords ? (
      <p className="text-xs text-muted-foreground h-4">₹ {numberToWords(value)}</p>
    ) : (
      <p className="text-xs text-muted-foreground h-4">{value} {unit}</p>
    )}
  </div>
);

// Helper for slider fields - defined globally in the module
const renderSlider = (id, label, value, setter, min, max, step, unit) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
    <div className="flex items-center space-x-2">
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => setter(val[0])}
        className="w-full"
      />
      <span className="text-sm font-semibold w-16 text-right">{value}{unit}</span>
    </div>
     <p className="text-xs text-muted-foreground h-4"></p> {/* Placeholder for consistent height */}
  </div>
);

const FinancialPlanner = () => {
  // General finances
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
  
  // SIP (investments)
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  
  // House planning
  const [houseValue, setHouseValue] = useState(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanInterestRate, setLoanInterestRate] = useState(8);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [yearsToBuyHouse, setYearsToBuyHouse] = useState(5);
  
  // SWP (for retirement)
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlySwpAfterRetirement, setMonthlySwpAfterRetirement] = useState(50000);
  const [desiredRetirementCorpus, setDesiredRetirementCorpus] = useState(20000000);
  const [inflationRate, setInflationRate] = useState(6);

  const [swpStartAge, setSwpStartAge] = useState(60);
  const [swpAmount, setSwpAmount] = useState(50000);
  const [swpGrowthRate, setSwpGrowthRate] = useState(6);
  
  const [data, setData] = useState([]);
  const [retirementStats, setRetirementStats] = useState({
    projectedCorpus: 0,
    yearsOfSustainability: 0,
    monthlyShortfall: 0,
    corpusAchievementPercentage: 0
  });

//   console.log("rendignig")

const calculateRetirementStats = useCallback((projection, retirementAge, monthlySwpAfterRetirement, inflationRate, currentAge, sipReturnRate, desiredRetirementCorpus, setRetirementStats) => {
  const projectedCorpus = projection.find(p => p.age === retirementAge)?.investments || 0;
  const inflationAdjustedMonthlyExpense = monthlySwpAfterRetirement *
    Math.pow(1 + inflationRate / 100, retirementAge - currentAge);

  let yearsOfSustainability = 0;
  let remainingCorpus = projectedCorpus;

  for (let i = retirementAge - currentAge; i < projection.length; i++) {
    if (remainingCorpus <= 0) break;
    remainingCorpus = projection[i].investments;
    yearsOfSustainability++;
  }

  const monthlyShortfall = Math.max(0, inflationAdjustedMonthlyExpense - (projectedCorpus * (sipReturnRate / 100) / 12));
  const corpusAchievementPercentage = Math.min(100, (projectedCorpus / desiredRetirementCorpus) * 100);

  setRetirementStats({
    projectedCorpus,
    yearsOfSustainability,
    monthlyShortfall,
    corpusAchievementPercentage
  });
}, []); // Assuming setRetirementStats is stable, other dependencies need to be listed if they change


const calculateProjection = useCallback(() => {
    let projection = [];
    let savings = 0;
    let investments = 0;
    let loanAmount = 0;
    let age = currentAge;
    
    const downPayment = houseValue * (downPaymentPercent / 100);
    const loanTenureMonths = loanTenureYears * 12;
    const monthlyLoanPayment = (houseValue - downPayment) * (loanInterestRate / 1200) * 
      Math.pow(1 + loanInterestRate / 1200, loanTenureMonths) / 
      (Math.pow(1 + loanInterestRate / 1200, loanTenureMonths) - 1);

    for (let year = 0; year <= Math.max(retirementAge, swpStartAge) - currentAge + 30; year++) {
      let yearlySavings = (monthlyIncome - monthlyExpenses - monthlySIP) * 12;
      let yearlyInvestments = monthlySIP * 12;
      
      if (year === yearsToBuyHouse) {
        if (savings >= downPayment) {
          savings -= downPayment;
          loanAmount = houseValue - downPayment;
        } else {
          // Not enough for down payment, adjust the plan
          continue;
        }
      }
      
      if (loanAmount > 0) {
        const yearlyLoanPayment = monthlyLoanPayment * 12;
        yearlySavings -= yearlyLoanPayment;
        loanAmount -= (yearlyLoanPayment - (loanAmount * loanInterestRate / 100));
        if (loanAmount < 0) loanAmount = 0;
      }
      
      savings += yearlySavings;
      investments *= (1 + sipReturnRate / 100);
      investments += yearlyInvestments;

      // Apply SWP after retirement
      if (age >= swpStartAge) {
        const currentSwpAmount = swpAmount * Math.pow(1 + swpGrowthRate / 100, age - swpStartAge);
        const yearlyWithdrawal = currentSwpAmount * 12;
        if (investments >= yearlyWithdrawal) {
          investments -= yearlyWithdrawal;
        } else {
          // Not enough for withdrawal, adjust the plan
          investments = 0;
        }
      }

      projection.push({
        year,
        age,
        savings: Math.round(savings),
        investments: Math.round(investments),
        totalWealth: Math.round(savings + investments),
        loanRemaining: Math.round(loanAmount),
        swpAmount: age >= swpStartAge ? Math.round(swpAmount * Math.pow(1 + swpGrowthRate / 100, age - swpStartAge)) : 0
      });
      
      age++;
    }

    setData(projection);
    // Pass necessary state values and setters to calculateRetirementStats
    calculateRetirementStats(
      projection, retirementAge, monthlySwpAfterRetirement, inflationRate,
      currentAge, sipReturnRate, desiredRetirementCorpus, setRetirementStats
    );
  }, [
    currentAge, houseValue, downPaymentPercent, loanTenureYears, loanInterestRate,
    retirementAge, swpStartAge, monthlyIncome, monthlyExpenses, monthlySIP,
    yearsToBuyHouse, sipReturnRate, swpAmount, swpGrowthRate,
    setData, calculateRetirementStats, // calculateRetirementStats is now a dependency
    // Dependencies for calculateRetirementStats that are passed to it:
    monthlySwpAfterRetirement, inflationRate, desiredRetirementCorpus, setRetirementStats
    // Note: setRetirementStats is stable, but other direct state values used by calculateRetirementStats also make calculateProjection dependent on them.
]);

  useEffect(() => {
    calculateProjection();
  }, [calculateProjection]); // useEffect now depends on the memoized calculateProjection

  const formatRupees = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl">Comprehensive Indian Financial Planner</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sip">SIP</TabsTrigger>
            <TabsTrigger value="house">House</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="swp">SWP</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput("monthlyIncome", "Monthly Income (₹)", monthlyIncome, setMonthlyIncome, "₹", true)}
              {renderInput("monthlyExpenses", "Monthly Expenses (₹)", monthlyExpenses, setMonthlyExpenses, "₹", true)}
            </div>
          </TabsContent>

          <TabsContent value="sip">
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput("monthlySIP", "Monthly SIP Amount (₹)", monthlySIP, setMonthlySIP, "₹", true)}
              {renderInput("sipReturnRate", "Expected Annual Return Rate (%)", sipReturnRate, setSipReturnRate, "%")}
            </div>
          </TabsContent>

          <TabsContent value="house">
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput("houseValue", "House Value (₹)", houseValue, setHouseValue, "₹", true)}
              {renderSlider("downPaymentPercent", "Down Payment (%)", downPaymentPercent, setDownPaymentPercent, 10, 50, 1, "%")}
              {renderInput("loanInterestRate", "Loan Interest Rate (%)", loanInterestRate, setLoanInterestRate, "%")}
              {renderInput("loanTenureYears", "Loan Tenure (Years)", loanTenureYears, setLoanTenureYears, "years")}
              {renderInput("yearsToBuyHouse", "Years until House Purchase", yearsToBuyHouse, setYearsToBuyHouse, "years")}
            </div>
          </TabsContent>

          <TabsContent value="retirement">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {renderInput("currentAge", "Current Age", currentAge, setCurrentAge, "years")}
              {renderInput("retirementAge", "Retirement Age", retirementAge, setRetirementAge, "years")}
              {renderInput("monthlySwpAfterRetirement", "Desired Monthly Expense after Retirement (₹)", monthlySwpAfterRetirement, setMonthlySwpAfterRetirement, "₹", true)}
              {renderInput("desiredRetirementCorpus", "Desired Retirement Corpus (₹)", desiredRetirementCorpus, setDesiredRetirementCorpus, "₹", true)}
              {renderInput("inflationRate", "Expected Inflation Rate (%)", inflationRate, setInflationRate, "%")}
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Info size={20} className="mr-2 text-blue-500" />Retirement Readiness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <Label className="text-sm font-medium">Projected Retirement Corpus</Label>
                    <span className="text-xs text-muted-foreground">Target: {formatRupees(desiredRetirementCorpus)}</span>
                  </div>
                  <Progress value={retirementStats.corpusAchievementPercentage} className="w-full h-3" />
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-semibold">{formatRupees(retirementStats.projectedCorpus)}</span>
                    <span className={`font-semibold ${retirementStats.corpusAchievementPercentage >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {retirementStats.corpusAchievementPercentage.toFixed(1)}% Reached
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard
                    title="Years of Sustainability"
                    value={`${retirementStats.yearsOfSustainability} years`}
                    icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
                    description="How long your corpus might last."
                  />
                  <StatCard
                    title="Monthly Shortfall"
                    value={formatRupees(retirementStats.monthlyShortfall)}
                    icon={retirementStats.monthlyShortfall > 0 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <Landmark className="h-4 w-4 text-green-500" />}
                    description={retirementStats.monthlyShortfall > 0 ? "Potential gap in monthly income." : "Your income covers expenses."}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swp">
            <div className="grid md:grid-cols-2 gap-6">
              {renderInput("swpStartAge", "SWP Start Age", swpStartAge, setSwpStartAge, "years")}
              {renderInput("swpAmount", "Initial Monthly SWP Amount (₹)", swpAmount, setSwpAmount, "₹", true)}
              {renderInput("swpGrowthRate", "SWP Annual Growth Rate (%)", swpGrowthRate, setSwpGrowthRate, "%")}
              </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><TrendingUp size={20} className="mr-2 text-indigo-500"/>Financial Projection Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -10, fontSize: 12 }} tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(value) => `₹${value / 100000}L`}
                label={{ value: 'Amount (Lakhs)', angle: -90, position: 'insideLeft', offset: -10, fontSize: 12 }}
                tick={{ fontSize: 11 }}
                tickCount={8}
              />
              <Tooltip
                formatter={(value, name) => [formatRupees(value), name]}
                labelStyle={{ fontSize: 13, fontWeight: 'bold' }}
                itemStyle={{ fontSize: 12 }}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
              <Line type="monotone" dataKey="savings" stroke="#3b82f6" name="Savings" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="investments" stroke="#10b981" name="Investments" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="totalWealth" stroke="#f59e0b" name="Total Wealth" dot={false} strokeWidth={2.5} />
              <Line type="monotone" dataKey="loanRemaining" stroke="#ef4444" name="Loan Remaining" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="swpAmount" stroke="#8b5cf6" name="SWP Amount" dot={false} strokeWidth={2} />
              <ReferenceLine x={retirementAge} stroke="#e11d48" strokeDasharray="4 4" label={{ value: "Retirement", fontSize: 10, position: 'insideTopRight', fill: '#e11d48' }} />
              <ReferenceLine x={swpStartAge} stroke="#059669" strokeDasharray="4 4" label={{ value: "SWP Start", fontSize: 10, position: 'insideTopRight', fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialPlanner;












// "use client"
// import React, { useState, useEffect } from 'react';
// import { Button, Card, CardContent, CardHeader, Input, Slider } from '@mui/material';
// import { BarChart } from '@mui/x-charts';
// import { numberToWords } from '@/utils/numberToWords';

// const FinancialPlanner = () => {
//     const [currentSalary, setCurrentSalary] = useState(50000);
//     const [percentageIncrease, setPercentageIncrease] = useState(5);
//     const [sipPercentage, setSipPercentage] = useState(20);
//     const [loanAmount, setLoanAmount] = useState(2000000);
//     const [loanInterestRate, setLoanInterestRate] = useState(8);
//     const [loanTenure, setLoanTenure] = useState(20);
//     const [planningYears, setPlanningYears] = useState(30);
    
//     const [monthlySalaryData, setMonthlySalaryData] = useState([]);
//     const [monthlySipData, setMonthlySipData] = useState([]);
//     const [monthlyEmiData, setMonthlyEmiData] = useState([]);
//     const [yearLabels, setYearLabels] = useState([]);

//     const calculateEMI = (principal, rate, tenure) => {
//         const monthlyRate = rate / 12 / 100;
//         const totalPayments = tenure * 12;
//         return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
//     };

//     const calculateFinancialPlan = () => {
//         const monthlyEMI = calculateEMI(loanAmount, loanInterestRate, loanTenure);
//         const data = [];

//         let currentSalaryAmount = currentSalary;

//         for (let year = 1; year <= planningYears; year++) {
//             const monthlySalary = currentSalaryAmount;
//             const monthlySip = currentSalaryAmount * (sipPercentage / 100);
//             const monthlyEmi = year <= loanTenure ? monthlyEMI : 0;

//             data.push({
//                 year,
//                 monthlySalary,
//                 monthlySip,
//                 monthlyEmi
//             });

//             currentSalaryAmount *= (1 + percentageIncrease / 100);
//         }

//         setYearLabels(data.map(item => `Year ${item.year}`));
//         setMonthlySalaryData(data.map(item => item.monthlySalary));
//         setMonthlySipData(data.map(item => item.monthlySip));
//         setMonthlyEmiData(data.map(item => item.monthlyEmi));
//     };

//     useEffect(() => {
//         calculateFinancialPlan();
//     }, [currentSalary, percentageIncrease, sipPercentage, loanAmount, loanInterestRate, loanTenure, planningYears]);

//     return (
//         <Card className="w-full">
//             <CardHeader title="Financial Planner: Home Affordability and SIP Impact" />
//             <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="currentSalary">Current Monthly Salary (₹)</label>
//                         <Input
//                             id="currentSalary"
//                             type="number"
//                             value={currentSalary}
//                             onChange={(e) => setCurrentSalary(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(currentSalary)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="percentageIncrease">Yearly Salary Increase (%)</label>
//                         <Slider
//                             id="percentageIncrease"
//                             value={percentageIncrease}
//                             onChange={(_, value) => setPercentageIncrease(Number(value))}
//                             min={0}
//                             max={20}
//                             step={0.5}
//                             marks
//                             valueLabelDisplay="auto"
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="sipPercentage">SIP Percentage of Salary (%)</label>
//                         <Slider
//                             id="sipPercentage"
//                             value={sipPercentage}
//                             onChange={(_, value) => setSipPercentage(Number(value))}
//                             min={0}
//                             max={50}
//                             step={1}
//                             marks
//                             valueLabelDisplay="auto"
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanAmount">Home Loan Amount (₹)</label>
//                         <Input
//                             id="loanAmount"
//                             type="number"
//                             value={loanAmount}
//                             onChange={(e) => setLoanAmount(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(loanAmount)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanInterestRate">Loan Interest Rate (%)</label>
//                         <Slider
//                             id="loanInterestRate"
//                             value={loanInterestRate}
//                             onChange={(_, value) => setLoanInterestRate(Number(value))}
//                             min={5}
//                             max={15}
//                             step={0.1}
//                             marks
//                             valueLabelDisplay="auto"
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanTenure">Loan Tenure (Years)</label>
//                         <Slider
//                             id="loanTenure"
//                             value={loanTenure}
//                             onChange={(_, value) => setLoanTenure(Number(value))}
//                             min={5}
//                             max={30}
//                             step={1}
//                             marks
//                             valueLabelDisplay="auto"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-6 h-[600px]">
//                     <BarChart
//                         height={500}
//                         series={[
//                             { data: monthlySalaryData, label: 'Monthly Salary', stack: 'total', color: '#4CAF50' },
//                             { data: monthlySipData, label: 'Monthly SIP', stack: 'expenses', color: '#2196F3' },
//                             { data: monthlyEmiData, label: 'Monthly EMI', stack: 'expenses', color: '#FFC107' },
//                         ]}
//                         xAxis={[{ data: yearLabels, scaleType: 'band' }]}
//                         yAxis={[{ label: 'Amount (₹)' }]}
//                         slotProps={{
//                             legend: {
//                                 direction: 'row',
//                                 position: { vertical: 'top', horizontal: 'middle' },
//                                 padding: 0,
//                             },
//                         }}
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <p><strong>Home Affordability:</strong> Based on your current salary and chosen SIP, you can afford a home loan EMI of up to ₹{Math.max(...monthlyEmiData)?.toLocaleString()} per month.</p>
//                     <p><strong>SIP Impact:</strong> Your monthly SIP starts at ₹{monthlySipData[0]?.toLocaleString()} and grows to ₹{monthlySipData[monthlySipData.length - 1]?.toLocaleString()} by the end of the planning period.</p>
//                     <p><strong>Financial Health:</strong> {monthlySipData[0] + monthlyEmiData[0] > monthlySalaryData[0] ? "Warning: Your initial combined SIP and EMI exceed your monthly salary. Consider adjusting your plan." : "Your initial financial plan looks healthy, with room for both savings and loan repayment."}</p>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default FinancialPlanner;











// "use client"
// import React, { useState, useEffect } from 'react';
// import { Button, Card, CardContent, CardHeader, Input } from '@mui/material';
// import { LineChart } from '@mui/x-charts';
// import { numberToWords } from '@/utils/numberToWords';

// const FinancialPlanner = () => {
//     const [currentSalary, setCurrentSalary] = useState(50000);
//     const [percentageIncrease, setPercentageIncrease] = useState(5);
//     const [sipStartYear, setSipStartYear] = useState(1);
//     const [emiStartYear, setEmiStartYear] = useState(3);
//     const [lumpsumInvestment, setLumpsumInvestment] = useState(100000);
//     const [lumpsumDownpayment, setLumpsumDownpayment] = useState(500000);
//     const [planningYears, setPlanningYears] = useState(30);
//     const [expectedReturnRate, setExpectedReturnRate] = useState(12);
//     const [loanAmount, setLoanAmount] = useState(2000000);
//     const [loanInterestRate, setLoanInterestRate] = useState(8);
//     const [loanTenure, setLoanTenure] = useState(20);
//     const [sipPercentage, setSipPercentage] = useState(20);
    
//     const [xAxis, setXAxis] = useState([]);
//     const [salaryData, setSalaryData] = useState([]);
//     const [sipData, setSipData] = useState([]);
//     const [emiData, setEmiData] = useState([]);
//     const [investmentData, setInvestmentData] = useState([]);
//     const [loanBalanceData, setLoanBalanceData] = useState([]);

//     const calculateMonthlyRate = (annualRate) => {
//         return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
//     };

//     const calculateEMI = (principal, rate, tenure) => {
//         const monthlyRate = rate / 12 / 100;
//         const totalPayments = tenure * 12;
//         return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
//     };

//     const calculateFinancialPlan = () => {
//         const monthlyRate = calculateMonthlyRate(expectedReturnRate);
//         const monthlyEMI = calculateEMI(loanAmount, loanInterestRate, loanTenure);
//         const data = [];

//         let currentSalaryAmount = currentSalary;
//         let totalInvestment = lumpsumInvestment;
//         let remainingLoanBalance = loanAmount;
//         let sipAmount = 0;
//         let emiAmount = 0;

//         for (let year = 1; year <= planningYears; year++) {
//             if (year >= sipStartYear) {
//                 sipAmount = currentSalaryAmount * (sipPercentage / 100);
//             }
//             if (year >= emiStartYear && year < emiStartYear + loanTenure) {
//                 emiAmount = monthlyEMI;
//                 remainingLoanBalance = Math.max(0, remainingLoanBalance - (monthlyEMI * 12 - (remainingLoanBalance * loanInterestRate / 100)));
//             } else {
//                 emiAmount = 0;
//             }

//             totalInvestment = (totalInvestment + sipAmount * 12) * (1 + expectedReturnRate / 100);

//             data.push({
//                 year,
//                 salary: Math.round(currentSalaryAmount * 12),
//                 sip: Math.round(sipAmount * 12),
//                 emi: Math.round(emiAmount * 12),
//                 investment: Math.round(totalInvestment),
//                 loanBalance: Math.round(remainingLoanBalance)
//             });

//             currentSalaryAmount *= (1 + percentageIncrease / 100);
//         }

//         setXAxis(data.map(item => item.year));
//         setSalaryData(data.map(item => item.salary));
//         setSipData(data.map(item => item.sip));
//         setEmiData(data.map(item => item.emi));
//         setInvestmentData(data.map(item => item.investment));
//         setLoanBalanceData(data.map(item => item.loanBalance));
//     };

//     useEffect(() => {
//         calculateFinancialPlan();
//     }, [currentSalary, percentageIncrease, sipStartYear, emiStartYear, lumpsumInvestment, lumpsumDownpayment, planningYears, expectedReturnRate, loanAmount, loanInterestRate, loanTenure, sipPercentage]);

//     return (
//         <Card className="w-full">
//             <CardHeader title="Financial Planner" />
//             <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="currentSalary">Current Monthly Salary (₹)</label>
//                         <Input
//                             id="currentSalary"
//                             type="number"
//                             value={currentSalary}
//                             onChange={(e) => setCurrentSalary(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(currentSalary)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="percentageIncrease">Yearly Salary Increase (%)</label>
//                         <Input
//                             id="percentageIncrease"
//                             type="number"
//                             value={percentageIncrease}
//                             onChange={(e) => setPercentageIncrease(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="sipStartYear">SIP Start Year</label>
//                         <Input
//                             id="sipStartYear"
//                             type="number"
//                             value={sipStartYear}
//                             onChange={(e) => setSipStartYear(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="emiStartYear">EMI Start Year</label>
//                         <Input
//                             id="emiStartYear"
//                             type="number"
//                             value={emiStartYear}
//                             onChange={(e) => setEmiStartYear(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="lumpsumInvestment">Lumpsum Investment (₹)</label>
//                         <Input
//                             id="lumpsumInvestment"
//                             type="number"
//                             value={lumpsumInvestment}
//                             onChange={(e) => setLumpsumInvestment(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(lumpsumInvestment)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="lumpsumDownpayment">Lumpsum Downpayment (₹)</label>
//                         <Input
//                             id="lumpsumDownpayment"
//                             type="number"
//                             value={lumpsumDownpayment}
//                             onChange={(e) => setLumpsumDownpayment(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(lumpsumDownpayment)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="planningYears">Planning Years</label>
//                         <Input
//                             id="planningYears"
//                             type="number"
//                             value={planningYears}
//                             onChange={(e) => setPlanningYears(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="expectedReturnRate">Expected Investment Return Rate (%)</label>
//                         <Input
//                             id="expectedReturnRate"
//                             type="number"
//                             value={expectedReturnRate}
//                             onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanAmount">Loan Amount (₹)</label>
//                         <Input
//                             id="loanAmount"
//                             type="number"
//                             value={loanAmount}
//                             onChange={(e) => setLoanAmount(Number(e.target.value))}
//                         />
//                         <span className="text-sm text-red-500">₹ {numberToWords(loanAmount)}</span>
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanInterestRate">Loan Interest Rate (%)</label>
//                         <Input
//                             id="loanInterestRate"
//                             type="number"
//                             value={loanInterestRate}
//                             onChange={(e) => setLoanInterestRate(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="loanTenure">Loan Tenure (Years)</label>
//                         <Input
//                             id="loanTenure"
//                             type="number"
//                             value={loanTenure}
//                             onChange={(e) => setLoanTenure(Number(e.target.value))}
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-sm font-medium text-gray-700' htmlFor="sipPercentage">SIP Percentage of Salary (%)</label>
//                         <Input
//                             id="sipPercentage"
//                             type="number"
//                             value={sipPercentage}
//                             onChange={(e) => setSipPercentage(Number(e.target.value))}
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-6 h-[600px]">
//                     <LineChart
//                         height={600}
//                         xAxis={[{ data: xAxis, label: "Years", min: 0 }]}
//                         series={[
//                             // { data: salaryData, label: "Yearly Salary", curve: 'monotoneX', color: 'blue' },
//                             { data: sipData, label: "Yearly SIP", curve: 'stepAfter', color: 'green' },
//                             { data: emiData, label: "Yearly EMI", curve: 'stepAfter', color: 'red' },
//                             { data: investmentData, label: "Total Investment", curve: 'monotoneX' },
//                             { data: loanBalanceData, label: "Loan Balance", curve: 'monotoneX', color: 'orange' },
//                         ]}
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <p>Final Yearly Salary: ₹{salaryData[salaryData.length - 1]?.toLocaleString()} ({numberToWords(salaryData[salaryData.length - 1])})</p>
//                     <p>Final Yearly SIP: ₹{sipData[sipData.length - 1]?.toLocaleString()} ({numberToWords(sipData[sipData.length - 1])})</p>
//                     <p>Final Investment Value: ₹{investmentData[investmentData.length - 1]?.toLocaleString()} ({numberToWords(investmentData[investmentData.length - 1])})</p>
//                     <p>Loan Balance at End: ₹{loanBalanceData[loanBalanceData.length - 1]?.toLocaleString()} ({numberToWords(loanBalanceData[loanBalanceData.length - 1])})</p>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default FinancialPlanner;