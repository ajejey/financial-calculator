"use client"
import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
// import { Input } from './ui/input';
// import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { numberToWords } from '@/utils/numberToWords';
import RotaryDial from '../Components/ui/RotaryDial'; // Import RotaryDial
import MobileLineChart from '../Components/MobileLineChart'; // Import MobileLineChart

const MobileFinancialPlanner = () => {
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

const calculateProjection = () => {
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
    calculateRetirementStats(projection);
  };

  const calculateRetirementStats = (projection) => {
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
  };

  useEffect(() => {
    calculateProjection();
  }, [monthlyIncome, monthlyExpenses, monthlySIP, sipReturnRate, houseValue, downPaymentPercent,
      loanInterestRate, loanTenureYears, yearsToBuyHouse, retirementAge, currentAge,
      monthlySwpAfterRetirement, desiredRetirementCorpus, inflationRate, swpStartAge, swpAmount, swpGrowthRate, calculateProjection]); // Added calculateProjection

  const formatRupees = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Comprehensive Indian Financial Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sip">SIP</TabsTrigger>
            <TabsTrigger value="house">House</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="swp">SWP</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-6 mb-4"> {/* Changed to 1 column for RotaryDials */}
              <div className="flex flex-col items-center">
                <Label htmlFor="monthlyIncome" className="mb-2">Monthly Income (₹)</Label>
                <RotaryDial
                  value={monthlyIncome}
                  onChange={setMonthlyIncome}
                  min={0}
                  max={500000}
                  step={1000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(monthlyIncome)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="monthlyExpenses" className="mb-2">Monthly Expenses (₹)</Label>
                <RotaryDial
                  value={monthlyExpenses}
                  onChange={setMonthlyExpenses}
                  min={0}
                  max={300000}
                  step={1000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(monthlyExpenses)}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sip">
            <div className="grid grid-cols-1 gap-6 mb-4"> {/* Changed to 1 column */}
              <div className="flex flex-col items-center">
                <Label htmlFor="monthlySIP" className="mb-2">Monthly SIP Amount (₹)</Label>
                <RotaryDial
                  value={monthlySIP}
                  onChange={setMonthlySIP}
                  min={0}
                  max={100000}
                  step={500}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(monthlySIP)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="sipReturnRate" className="mb-2">Expected Annual Return Rate (%)</Label>
                <RotaryDial
                  value={sipReturnRate}
                  onChange={setSipReturnRate}
                  min={0}
                  max={30}
                  step={0.5}
                />
                <span className="mt-1 text-xs text-muted-foreground">{sipReturnRate}%</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="house">
            <div className="grid grid-cols-1 gap-6 mb-4"> {/* Changed to 1 column */}
              <div className="flex flex-col items-center">
                <Label htmlFor="houseValue" className="mb-2">House Value (₹)</Label>
                <RotaryDial
                  value={houseValue}
                  onChange={setHouseValue}
                  min={1000000}
                  max={50000000}
                  step={100000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(houseValue)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="downPaymentPercent" className="mb-2">Down Payment (%)</Label>
                <RotaryDial
                  value={downPaymentPercent}
                  onChange={setDownPaymentPercent}
                  min={10}
                  max={50}
                  step={1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{downPaymentPercent}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="loanInterestRate" className="mb-2">Loan Interest Rate (%)</Label>
                <RotaryDial
                  value={loanInterestRate}
                  onChange={setLoanInterestRate}
                  min={1}
                  max={20}
                  step={0.1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{loanInterestRate}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="loanTenureYears" className="mb-2">Loan Tenure (Years)</Label>
                <RotaryDial
                  value={loanTenureYears}
                  onChange={setLoanTenureYears}
                  min={1}
                  max={30}
                  step={1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{loanTenureYears} years</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="yearsToBuyHouse" className="mb-2">Years until House Purchase</Label>
                <RotaryDial
                  value={yearsToBuyHouse}
                  onChange={setYearsToBuyHouse}
                  min={0}
                  max={20}
                  step={1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{yearsToBuyHouse} years</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="retirement">
            <div className="grid grid-cols-1 gap-6 mb-4"> {/* Changed to 1 column */}
              <div className="flex flex-col items-center">
                <Label htmlFor="currentAge" className="mb-2">Current Age</Label>
                <RotaryDial
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={80}
                  step={1}
                />
                 <span className="mt-1 text-xs text-muted-foreground">{currentAge} years</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="retirementAge" className="mb-2">Retirement Age</Label>
                <RotaryDial
                  value={retirementAge}
                  onChange={setRetirementAge}
                  min={40}
                  max={80}
                  step={1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{retirementAge} years</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="monthlySwpAfterRetirement" className="mb-2">Desired Monthly Expense after Retirement (₹)</Label>
                <RotaryDial
                  value={monthlySwpAfterRetirement}
                  onChange={setMonthlySwpAfterRetirement}
                  min={10000}
                  max={500000}
                  step={1000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(monthlySwpAfterRetirement)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="desiredRetirementCorpus" className="mb-2">Desired Retirement Corpus (₹)</Label>
                <RotaryDial
                  value={desiredRetirementCorpus}
                  onChange={setDesiredRetirementCorpus}
                  min={1000000}
                  max={100000000}
                  step={100000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(desiredRetirementCorpus)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="inflationRate" className="mb-2">Expected Inflation Rate (%)</Label>
                <RotaryDial
                  value={inflationRate}
                  onChange={setInflationRate}
                  min={0}
                  max={15}
                  step={0.1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{inflationRate}%</span>
              </div>
            </div>
            {/* Retirement Readiness section correctly placed within Retirement Tab */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-center">Retirement Readiness</h3>
              <div className="mb-4 px-2">
                <Label className="text-xs">Projected vs. Desired Corpus</Label>
                <Progress value={retirementStats.corpusAchievementPercentage} className="w-full" />
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatRupees(retirementStats.projectedCorpus)}</span>
                  <span>{formatRupees(desiredRetirementCorpus)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Years of Sustainability</Label>
                  <p className="text-2xl font-bold">{retirementStats.yearsOfSustainability} years</p>
                </div>
                <div>
                  <Label>Monthly Shortfall</Label>
                  <p className="text-2xl font-bold">{formatRupees(retirementStats.monthlyShortfall)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          {/* Correct SWP Tab Content */}
          <TabsContent value="swp">
            <div className="grid grid-cols-1 gap-6 mb-4">
              <div className="flex flex-col items-center">
                <Label htmlFor="swpStartAge" className="mb-2">SWP Start Age</Label>
                <RotaryDial
                  value={swpStartAge}
                  onChange={setSwpStartAge}
                  min={50}
                  max={80}
                  step={1}
                />
                <span className="mt-1 text-xs text-muted-foreground">{swpStartAge} years</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="swpAmount" className="mb-2">Initial Monthly SWP Amount (₹)</Label>
                <RotaryDial
                  value={swpAmount}
                  onChange={setSwpAmount}
                  min={10000}
                  max={200000}
                  step={1000}
                />
                <span className="mt-1 text-xs text-muted-foreground">₹ {numberToWords(swpAmount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="swpGrowthRate" className="mb-2">SWP Annual Growth Rate (%)</Label>
                <RotaryDial
                  value={swpGrowthRate}
                  onChange={setSwpGrowthRate}
                  min={0}
                  max={10}
                  step={0.5}
                />
                <span className="mt-1 text-xs text-muted-foreground">{swpGrowthRate}%</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 pt-4 border-t">
          <MobileLineChart
            data={data}
            retirementAge={retirementAge}
            swpStartAge={swpStartAge}
            formatRupees={formatRupees}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileFinancialPlanner;












// "use client"
// import React, { useState, useEffect } from 'react';
// import { Button, Card, CardContent, CardHeader, Input, Slider } from '@mui/material';
// import { BarChart } from '@mui/x-charts';
// import { numberToWords } from '@/utils/numberToWords';

// const MobileFinancialPlanner = () => {
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

// export default MobileFinancialPlanner;











// "use client"
// import React, { useState, useEffect } from 'react';
// import { Button, Card, CardContent, CardHeader, Input } from '@mui/material';
// import { LineChart } from '@mui/x-charts';
// import { numberToWords } from '@/utils/numberToWords';

// const MobileFinancialPlanner = () => {
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

// export default MobileFinancialPlanner;
