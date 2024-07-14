"use client"
import React, { useState, useEffect } from 'react';
import { numberToWords } from '@/utils/numberToWords';
import { Button, Card, CardContent, CardHeader, Input, Tabs, Tab, Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const SIPCalculator = () => {
    // SIP and SWP state
    const [initialLumpsum, setInitialLumpsum] = useState(0);
    const [monthlyInvestment, setMonthlyInvestment] = useState(30000);
    const [expectedReturnRate, setExpectedReturnRate] = useState(12);
    const [investmentDuration, setInvestmentDuration] = useState(30);
    const [withdrawalAmount, setWithdrawalAmount] = useState(100000);
    const [withdrawalDuration, setWithdrawalDuration] = useState(20);
    const [swpStartYear, setSwpStartYear] = useState(30);

    // Home loan state
    const [loanAmount, setLoanAmount] = useState(5000000);
    const [loanTerm, setLoanTerm] = useState(20);
    const [loanInterestRate, setLoanInterestRate] = useState(7);
    const [downPayment, setDownPayment] = useState(1000000);
    const [loanStartYear, setLoanStartYear] = useState(0);

    // Results state
    const [chartData, setChartData] = useState([]);
    const [monthlyMortgage, setMonthlyMortgage] = useState(0);
    const [totalInterestPaid, setTotalInterestPaid] = useState(0);

    const [activeTab, setActiveTab] = useState(0);

    const calculateMonthlyRate = (annualRate) => {
        return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
    };

    const calculateFinances = () => {
        const monthlyInvestmentRate = calculateMonthlyRate(expectedReturnRate);
        const monthlyLoanRate = loanInterestRate / 100 / 12;
        const numberOfLoanPayments = loanTerm * 12;
        const monthlyMortgagePayment = loanAmount > 0 ?
            (loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, numberOfLoanPayments)) /
            (Math.pow(1 + monthlyLoanRate, numberOfLoanPayments) - 1) : 0;

        setMonthlyMortgage(monthlyMortgagePayment);

        const totalMonths = Math.max(investmentDuration, swpStartYear + withdrawalDuration, loanStartYear + loanTerm) * 12;

        let totalAmount = initialLumpsum;
        let investedAmount = initialLumpsum;
        let totalWithdrawalAmount = 0;
        let remainingLoanBalance = loanAmount;
        let totalInterest = 0;
        let homeValue = loanAmount + downPayment; // Assuming initial home value is loan + down payment

        const data = [];

        for (let i = 1; i <= totalMonths; i++) {
            const currentYear = Math.floor((i - 1) / 12);
            const currentMonth = (i - 1) % 12;

            // Investment calculations
            if (currentYear < investmentDuration) {
                const availableForInvestment = Math.max(0, monthlyInvestment - (currentYear >= loanStartYear ? monthlyMortgagePayment : 0));
                investedAmount += availableForInvestment;
                totalAmount = (totalAmount + availableForInvestment) * (1 + monthlyInvestmentRate);
            } else {
                totalAmount *= (1 + monthlyInvestmentRate);
            }

            // Withdrawal calculations
            if (currentYear >= swpStartYear && currentYear < swpStartYear + withdrawalDuration) {
                const monthlyWithdrawal = withdrawalAmount / 12;
                totalWithdrawalAmount += monthlyWithdrawal;
                totalAmount = Math.max(0, totalAmount - monthlyWithdrawal);
            }

            // Loan calculations
            if (currentYear >= loanStartYear && currentYear < loanStartYear + loanTerm) {
                const interestPayment = remainingLoanBalance * monthlyLoanRate;
                const principalPayment = monthlyMortgagePayment - interestPayment;
                remainingLoanBalance = Math.max(0, remainingLoanBalance - principalPayment);
                totalInterest += interestPayment;
            }

            // Home value appreciation (assuming 3% annual appreciation)
            homeValue *= Math.pow(1.03, 1 / 12);

            if (currentMonth === 11) {
                data.push({
                    year: currentYear + 1,
                    totalAmount: Math.round(totalAmount),
                    investedAmount: Math.round(investedAmount),
                    withdrawalAmount: Math.round(totalWithdrawalAmount),
                    loanBalance: Math.round(remainingLoanBalance),
                    homeEquity: Math.round(homeValue - remainingLoanBalance)
                });
            }
        }

        setChartData(data);
        setTotalInterestPaid(Math.round(totalInterest));
    };

    useEffect(() => {
        calculateFinances();
    }, [initialLumpsum, monthlyInvestment, expectedReturnRate, investmentDuration,
        withdrawalAmount, withdrawalDuration, swpStartYear, loanAmount, loanTerm,
        loanInterestRate, downPayment, loanStartYear]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader title="Comprehensive Financial Planner" />
            <CardContent>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Investments" />
                    <Tab label="Home Loan" />
                    <Tab label="Analysis" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* {activeTab === 0 && ( */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Initial Lumpsum (₹)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Initial Lumpsum (₹)"
                                    type="number"
                                    value={initialLumpsum}
                                    onChange={(e) => setInitialLumpsum(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">₹ {numberToWords(initialLumpsum)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Investment (₹)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Monthly Investment (₹)"
                                    type="number"
                                    value={monthlyInvestment}
                                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">₹ {numberToWords(monthlyInvestment)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expected Return Rate (%)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Expected Return Rate (%)"
                                    type="number"
                                    value={expectedReturnRate}
                                    onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{expectedReturnRate}%</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Investment Duration (Years)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Investment Duration (Years)"
                                    type="number"
                                    value={investmentDuration}
                                    onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{investmentDuration} years</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Withdrawal (₹)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Monthly Withdrawal (₹)"
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">₹ {numberToWords(withdrawalAmount)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Withdrawal Duration (Years)</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="Withdrawal Duration (Years)"
                                    type="number"
                                    value={withdrawalDuration}
                                    onChange={(e) => setWithdrawalDuration(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{withdrawalDuration} years</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">SWP Start Year</label>
                                <Input
                                    labelClassName="block text-sm font-medium text-gray-700"
                                    label="SWP Start Year"
                                    type="number"
                                    value={swpStartYear}
                                    onChange={(e) => setSwpStartYear(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{swpStartYear} years</span>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                    {/* )} */}

                    {/* {activeTab === 1 && ( */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                                <Input
                                    label="Loan Amount (₹)"
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">₹ {numberToWords(loanAmount)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
                                <Input
                                    label="Loan Term (Years)"
                                    type="number"
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{loanTerm} years</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Interest Rate (%)</label>
                                <Input
                                    label="Loan Interest Rate (%)"
                                    type="number"
                                    value={loanInterestRate}
                                    onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{loanInterestRate} %</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Down Payment (₹)</label>
                                <Input
                                    label="Down Payment (₹)"
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">₹ {numberToWords(downPayment)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Start Year</label>
                                <Input
                                    label="Loan Start Year"
                                    type="number"
                                    value={loanStartYear}
                                    onChange={(e) => setLoanStartYear(Number(e.target.value))}
                                />
                                <span className="text-sm block text-red-500">{loanStartYear} years</span>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                    {/* )} */}

                    {/* {activeTab === 2 && ( */}
                        <div>
                            <LineChart
                                // width={800}
                                height={700}
                                series={[
                                    { data: chartData.map(d => d.totalAmount), label: 'Total Amount' },
                                    { data: chartData.map(d => d.investedAmount), label: 'Invested Amount' },
                                    { data: chartData.map(d => d.withdrawalAmount), label: 'Withdrawal Amount' },
                                    { data: chartData.map(d => d.loanBalance), label: 'Loan Balance' },
                                    { data: chartData.map(d => d.homeEquity), label: 'Home Equity' },
                                ]}
                                xAxis={[{ data: chartData.map(d => d.year), label: 'Year' }]}
                            />

<Typography variant="h6" mt={4}>Financial Summary</Typography>
<Typography> <span className="text-red-500 font-bold">Monthly EMI:</span> ₹{monthlyMortgage.toLocaleString('en-IN')} ({numberToWords(Math.round(monthlyMortgage))})</Typography>
<Typography><span className="text-red-500 font-bold">Total Interest Paid on Home Loan:</span> ₹{totalInterestPaid.toLocaleString('en-IN')} ({numberToWords(totalInterestPaid)})</Typography>
<Typography><span className="text-red-500 font-bold">Final SIP Value:</span> ₹{chartData[chartData.length - 1]?.totalAmount.toLocaleString('en-IN')} ({numberToWords(chartData[chartData.length - 1]?.totalAmount)})</Typography>
<Typography><span className="text-red-500 font-bold">Total Amount Withdrawn (SWP):</span> ₹{chartData[chartData.length - 1]?.withdrawalAmount.toLocaleString('en-IN')} ({numberToWords(chartData[chartData.length - 1]?.withdrawalAmount)})</Typography>
<Typography><span className="text-red-500 font-bold">Final Property Value:</span> ₹{chartData[chartData.length - 1]?.homeEquity.toLocaleString('en-IN')} ({numberToWords(chartData[chartData.length - 1]?.homeEquity)})</Typography>

<Typography variant="body1" mt={2} sx={{ fontStyle: 'italic' }}>
    Simple Explanation: This summary shows your monthly home loan payment (EMI), the total interest youll pay over the loan period, how much your investments (SIP) will grow to, the total amount youll withdraw in retirement (SWP), and the estimated value of your property at the end. It helps you see how your home loan, investments, and retirement plans work together over time.
</Typography>
                        </div>
                    {/* )} */}
                </Box>
            </CardContent>
        </Card>
    );
};

export default SIPCalculator;