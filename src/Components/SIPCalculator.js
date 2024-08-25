"use client"
import { numberToWords } from '@/utils/numberToWords';
import { Button, Card, CardContent, CardHeader, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { ChevronsDown, ChevronsUp, CircleCheckBig } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const initialValueCombinations = [
    { initialLumpsum: 0, monthlyInvestment: 10000, expectedReturnRate: 18, investmentDuration: 10, withdrawalAmount: 45000, withdrawalDuration: 20, swpStartYear: 10 },
    { initialLumpsum: 500000, monthlyInvestment: 0, expectedReturnRate: 18, investmentDuration: 20, withdrawalAmount: 200000, withdrawalDuration: 20, swpStartYear: 20 },
    { initialLumpsum: 1000000, monthlyInvestment: 10000, expectedReturnRate: 12, investmentDuration: 20, withdrawalAmount: 200000, withdrawalDuration: 20, swpStartYear: 20 },
    { initialLumpsum: 0, monthlyInvestment: 30000, expectedReturnRate: 15, investmentDuration: 30, withdrawalAmount: 2000000, withdrawalDuration: 30, swpStartYear: 30 },

]

const SIPCalculator = () => {
    const [initialLumpsum, setInitialLumpsum] = useState(initialValueCombinations[1].initialLumpsum);
    const [monthlyInvestment, setMonthlyInvestment] = useState(initialValueCombinations[1].monthlyInvestment);
    const [expectedReturnRate, setExpectedReturnRate] = useState(initialValueCombinations[1].expectedReturnRate);
    const [investmentDuration, setInvestmentDuration] = useState(initialValueCombinations[1].investmentDuration);
    const [withdrawalAmount, setWithdrawalAmount] = useState(initialValueCombinations[1].withdrawalAmount);
    const [withdrawalDuration, setWithdrawalDuration] = useState(initialValueCombinations[1].withdrawalDuration);
    const [swpStartYear, setSwpStartYear] = useState(initialValueCombinations[1].swpStartYear);
    const [sipIncrementPercentage, setSipIncrementPercentage] = useState(5);



    const [chartData, setChartData] = useState([]);

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
        let currentMonthlyInvestment = monthlyInvestment;

        for (let i = 1; i <= totalMonths; i++) {
            const currentYear = Math.floor((i - 1) / 12);
            // const currentMonthlyInvestment = data[currentYear]?.monthlyInvestment ?? monthlyInvestment;
            
            if (i % 12 === 1 && currentYear > 0) {
                // Increase SIP at the start of each year (except the first year)
                currentMonthlyInvestment *= (1 + sipIncrementPercentage / 100);
            }
            const currentMonthlyWithdrawal = data[currentYear]?.monthlyWithdrawal ?? withdrawalAmount;

            if (i <= investmentDuration * 12) {
                investedAmount += currentMonthlyInvestment;
                totalAmount = (totalAmount + currentMonthlyInvestment) * (1 + monthlyRate);
            } else {
                totalAmount = totalAmount * (1 + monthlyRate);
            }

            if (i > swpStartYear * 12) {
                const monthlyWithdrawal = Math.min(currentMonthlyWithdrawal, totalAmount);
                totalWithdrawalAmount += monthlyWithdrawal;
                totalAmount = Math.max(0, totalAmount - monthlyWithdrawal);
            }

            if (i % 12 === 0) {
                data[currentYear] = {
                    year: currentYear + 1,
                    totalAmount: Math.round(totalAmount),
                    investedAmount: Math.round(investedAmount),
                    withdrawalAmount: Math.round(totalWithdrawalAmount),
                    monthlyInvestment: currentMonthlyInvestment,
                    monthlyWithdrawal: currentMonthlyWithdrawal
                };
            }
        }

        setChartData(data);
    };

    useEffect(() => {
        calculateInvestmentAndWithdrawal();
    }, [initialLumpsum, monthlyInvestment, expectedReturnRate, investmentDuration, withdrawalAmount, withdrawalDuration, swpStartYear, sipIncrementPercentage]);


    const recalculateTotalAmount = (data) => {
        const monthlyRate = calculateMonthlyRate(expectedReturnRate);
        let totalAmount = initialLumpsum;

        const updatedData = data.map((row, index) => {
            if (index === 0) {
                totalAmount = (totalAmount + row.investedAmount - initialLumpsum) * Math.pow(1 + monthlyRate, 12) - row.withdrawalAmount;
            } else {
                totalAmount = (totalAmount + row.investedAmount) * Math.pow(1 + monthlyRate, 12) - row.withdrawalAmount;
            }
            return { ...row, totalAmount: Math.round(totalAmount) };
        });

        setChartData(updatedData);
    };

    const handleCellEdit = (year, field, value) => {
        const updatedChartData = chartData.map(row => {
            if (row.year === year) {
                return { ...row, [field]: Number(value) };
            }
            return row;
        });
        setChartData(updatedChartData);
        recalculateTotalAmount(updatedChartData);
    };

    const handleRandomize = () => {
        const randomIndex = Math.floor(Math.random() * initialValueCombinations.length);
        const randomValueCombination = initialValueCombinations[randomIndex];
        setInitialLumpsum(randomValueCombination.initialLumpsum);
        setMonthlyInvestment(randomValueCombination.monthlyInvestment);
        setExpectedReturnRate(randomValueCombination.expectedReturnRate);
        setInvestmentDuration(randomValueCombination.investmentDuration);
        setWithdrawalAmount(randomValueCombination.withdrawalAmount);
        setWithdrawalDuration(randomValueCombination.withdrawalDuration);
        setSwpStartYear(randomValueCombination.swpStartYear);

    };

    return (
        <Card className="w-full ">
            <CardHeader title="SIP and SWP Calculator" className='pb-0' />
            <CardContent>
                {/* Card section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="bg-blue-500 text-white shadow-md rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Total Invested</h3>
                                <p className="text-3xl font-bold">₹{chartData[chartData.length - 1]?.investedAmount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                            <ChevronsUp size={48} />
                            </div>
                        </div>
                        <p className="mt-2 text-sm">({numberToWords(chartData[chartData.length - 1]?.investedAmount)})</p>
                    </div>

                    <div className="bg-green-500 text-white shadow-md rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Total Withdrawn</h3>
                                <p className="text-3xl font-bold">₹{chartData[chartData.length - 1]?.withdrawalAmount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                            <ChevronsDown size={48} />
                            </div>
                        </div>
                        <p className="mt-2 text-sm">{numberToWords(chartData[chartData.length - 1]?.withdrawalAmount)}</p>
                    </div>

                    <div className="bg-red-500 text-white shadow-md rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Final Amount</h3>
                                <p className="text-3xl font-bold">₹{chartData[chartData.length - 1]?.totalAmount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                            <CircleCheckBig size={48} />
                            </div>
                        </div>
                        <p className="mt-2 text-sm">({numberToWords(chartData[chartData.length - 1]?.totalAmount)})</p>
                    </div>
                </div>

                {/* Filter section */}
                <div className="mb-4 text-lg font-semibold">Filters</div>
                <div className="grid grid-cols-2 gap-1 mb-6 md:grid-cols-4 lg:grid-cols-7 border border-gray-300 p-4 bg-gray-50">
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="initialLumpsum">
                            Initial Lumpsum (₹)
                        </label>
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
                        <label className='block text-sm font-medium text-gray-700' htmlFor="monthlyInvestment">
                            Monthly Investment (₹)
                        </label>
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
                        <label className='block text-sm font-medium text-gray-700' htmlFor="sipIncrementPercentage">
                            SIP Increment (%)
                        </label>
                        <Input
                            id="sipIncrementPercentage"
                            type="number"
                            value={sipIncrementPercentage}
                            onChange={(e) => setSipIncrementPercentage(Number(e.target.value))}
                        />
                        <br />
                        <span className="text-sm text-red-500">{sipIncrementPercentage}%</span>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="expectedReturnRate">
                            Expected Return Rate (%)
                        </label>
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
                        <label className='block text-sm font-medium text-gray-700' htmlFor="investmentDuration">
                            Investment Duration (Years)
                        </label>
                        <Input
                            id="investmentDuration"
                            type="number"
                            value={investmentDuration}
                            onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="withdrawalAmount">
                            Monthly Withdrawal (₹)
                        </label>
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
                        <label className='block text-sm font-medium text-gray-700' htmlFor="swpStartYear">
                            SWP Start Year
                        </label>
                        <Input
                            id="swpStartYear"
                            type="number"
                            value={swpStartYear}
                            onChange={(e) => setSwpStartYear(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700' htmlFor="withdrawalDuration">
                            Withdrawal Duration (Years)
                        </label>
                        <Input
                            id="withdrawalDuration"
                            type="number"
                            value={withdrawalDuration}
                            onChange={(e) => setWithdrawalDuration(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={handleRandomize}>
                        Randomize Filters
                    </Button>
                </div>

                <div className="mt-6 h-[500px]">
                    <LineChart
                        height={500}
                        xAxis={[{ data: chartData.map(item => item.year), label: "Years", min: 0 }]}
                        series={[
                            { data: chartData.map(item => item.totalAmount), label: "Total Amount", curve: 'monotoneX' },
                            { data: chartData.map(item => item.investedAmount), label: "Invested Amount", curve: 'stepAfter' },
                            { data: chartData.map(item => item.withdrawalAmount), label: "Withdrawal Amount", curve: 'stepAfter' }
                        ]}
                    />
                </div>
                


                <TableContainer component={Paper} className="mt-6 overflow-x-auto h-[300px]">
                    <Table stickyHeader size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Year</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell align="right">Invested Amount</TableCell>
                                <TableCell align="right">Withdrawal Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {chartData.map((row) => (
                                <TableRow key={row.year}>
                                    <TableCell component="th" scope="row">{row.year}</TableCell>
                                    <TableCell align="right">₹{row.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell align="right">₹{row.investedAmount.toLocaleString()}</TableCell>

                                    <TableCell align="right">₹{row.withdrawalAmount.toLocaleString()}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default SIPCalculator;
