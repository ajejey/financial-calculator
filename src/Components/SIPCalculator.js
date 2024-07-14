"use client"
import { numberToWords } from '@/utils/numberToWords';
import { Button, Card, CardContent, CardHeader, Input } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import React, { useState, useEffect } from 'react';

const SIPCalculator = () => {
    const [initialLumpsum, setInitialLumpsum] = useState(300000);
    const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
    const [expectedReturnRate, setExpectedReturnRate] = useState(18);
    const [investmentDuration, setInvestmentDuration] = useState(10);
    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    const [withdrawalDuration, setWithdrawalDuration] = useState(20);
    const [swpStartYear, setSwpStartYear] = useState(0);

    const [xAxis, setXAxis] = useState([]);
    const [totalAmountData, setTotalAmountData] = useState([]);
    const [investedAmountData, setInvestedAmountData] = useState([]);
    const [withdrawalAmountData, setWithdrawalAmountData] = useState([]);

    const calculateMonthlyRate = (annualRate) => {
        const effectiveAnnualRate = Math.pow(1 + annualRate / 100, 1) - 1;
        return Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;
    };

    const calculateInvestmentAndWithdrawal = () => {
        const monthlyRate = calculateMonthlyRate(expectedReturnRate);
        const totalMonths = Math.max(investmentDuration, swpStartYear + withdrawalDuration) * 12;
    
        const data = [];
    
        let totalAmount = initialLumpsum;
        let investedAmount = initialLumpsum;
        let totalWithdrawalAmount = 0;
    
        for (let i = 1; i <= totalMonths; i++) {
            const currentYear = i / 12;
    
            // Investment phase
            if (currentYear <= investmentDuration) {
                investedAmount += monthlyInvestment;
                totalAmount = (totalAmount + monthlyInvestment) * (1 + monthlyRate);
            } else {
                // Growth phase (after investment ends)
                totalAmount = totalAmount * (1 + monthlyRate);
            }
    
            // Withdrawal phase
            if (currentYear > swpStartYear) {
                const monthlyWithdrawal = Math.min(withdrawalAmount, totalAmount);
                totalWithdrawalAmount += monthlyWithdrawal;
                totalAmount = Math.max(0, totalAmount - monthlyWithdrawal);
            }
    
            if (i % 12 === 0) {
                data.push({
                    year: currentYear,
                    totalAmount: Math.round(totalAmount),
                    investedAmount: Math.round(investedAmount),
                    withdrawalAmount: Math.round(totalWithdrawalAmount)
                });
            }
        }
    
        setXAxis(data.map(item => item.year));
        setTotalAmountData(data.map(item => item.totalAmount));
        setInvestedAmountData(data.map(item => item.investedAmount));
        setWithdrawalAmountData(data.map(item => item.withdrawalAmount));
    };

    useEffect(() => {
        calculateInvestmentAndWithdrawal();
    }, [initialLumpsum, monthlyInvestment, expectedReturnRate, investmentDuration, withdrawalAmount, withdrawalDuration, swpStartYear]);

    return (
        <Card className="w-full ">
            <CardHeader title="SIP and SWP Calculator" />
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="initialLumpsum">Initial Lumpsum (₹)</label>
                        <Input
                            id="initialLumpsum"
                            type="number"
                            inputProps={{ step: "1000" }}
                            value={initialLumpsum}
                            onChange={(e) => setInitialLumpsum(Number(e.target.value))}
                        />
                        <br />
                        <span className="text-sm text-red-500">₹ {numberToWords(initialLumpsum)}</span>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="monthlyInvestment">Monthly Investment (₹)</label>
                        <Input
                            id="monthlyInvestment"
                            type="number"
                            inputProps={{ step: "1000" }}
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                        />
                        <br />
                        <span className="text-sm text-red-500">₹ {numberToWords(monthlyInvestment)}</span>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="expectedReturnRate">Expected Return Rate (%)</label>
                        <Input
                            id="expectedReturnRate"
                            type="number"
                            value={expectedReturnRate}
                            onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                        />
                        <br />
                        <span className="text-sm text-red-500">{expectedReturnRate}%</span>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="investmentDuration">Investment Duration (Years)</label>
                        <Input
                            id="investmentDuration"
                            type="number"
                            value={investmentDuration}
                            onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="withdrawalAmount">Monthly Withdrawal (₹)</label>
                        <Input
                            id="withdrawalAmount"
                            type="number"
                            inputProps={{ step: "1000" }}
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                        />
                        <br />
                        <span className="text-sm text-red-500">₹ {numberToWords(withdrawalAmount)}</span>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="swpStartYear">SWP Start Year</label>
                        <Input
                            id="swpStartYear"
                            type="number"
                            value={swpStartYear}
                            onChange={(e) => setSwpStartYear(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="withdrawalDuration">Withdrawal Duration (Years)</label>
                        <Input
                            id="withdrawalDuration"
                            type="number"
                            value={withdrawalDuration}
                            onChange={(e) => setWithdrawalDuration(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="mt-6 h-[700px]">
                    <LineChart
                        height={700}
                        xAxis={[{ data: xAxis, label: "Years", min:0 }]}
                        series={[
                            { data: totalAmountData, label: "Total Amount", curve: 'monotoneX' },
                            { data: investedAmountData, label: "Invested Amount", curve: 'stepAfter' },
                            { data: withdrawalAmountData, label: "Withdrawal Amount", curve: 'stepAfter' }
                        ]}
                    />
                </div>
                <div className="mt-4">
                    <p>Total Invested: ₹{investedAmountData[investedAmountData.length - 1]?.toLocaleString()},  ({numberToWords(investedAmountData[investedAmountData.length - 1])})</p>

                    <p>Total Withdrawn: ₹{withdrawalAmountData[withdrawalAmountData.length - 1]?.toLocaleString()} ({numberToWords(withdrawalAmountData[withdrawalAmountData.length - 1])})</p>
                    <p>Final Amount: ₹{totalAmountData[totalAmountData.length - 1]?.toLocaleString('en-IN')} ({numberToWords(totalAmountData[totalAmountData.length - 1])})</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SIPCalculator;
