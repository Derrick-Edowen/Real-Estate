import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Indexcalc.css'


function Calculator() {
    const [homePrice, setHomePrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [monthlyAmortization, setMonthlyAmortization] = useState([]);
    const [annualAmortization, setAnnualAmortization] = useState([]);
    const [monthlyDropdownActive, setMonthlyDropdownActive] = useState(false);
    const [annualDropdownActive, setAnnualDropdownActive] = useState(false);
    const [principalPercentage, setPrincipalPercentage] = useState(0);
    const [interestPercentage, setInterestPercentage] = useState(0);
    const [chartInstance, setChartInstance] = useState(null);
    const [doughnutChartInstance, setDoughnutChartInstance] = useState(null);


    useEffect(() => {
        if (homePrice && downPaymentPercentage) {
            const downPaymentAmount = (homePrice * downPaymentPercentage) / 100;
            setLoanAmount(homePrice - downPaymentAmount);
        }
    }, [homePrice, downPaymentPercentage]);
    useEffect(() => {
        if (annualAmortization.length > 0) {
            renderLineChart();
        }
    }, [annualAmortization]);

    const calculateAmortization = () => {
        const monthlyInterestRate = interestRate / 100 / 12;
        const loanTermMonths = loanTerm * 12;
        const downPaymentAmount = (homePrice * downPaymentPercentage) / 100;
        const loanAmount = homePrice - downPaymentAmount;
        const mortgagePayment = (loanAmount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

        let remainingBalance = loanAmount;
        const monthlyAmortization = [];
        const annualAmortization = [];
        let month = 0;

        while (remainingBalance > 0 && month < loanTermMonths) {
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = mortgagePayment - interestPayment;
            remainingBalance -= principalPayment;

            monthlyAmortization.push({
                month: month + 1,
                principalPayment,
                interestPayment,
                remainingBalance,
                mortgagePayment
            });

            if ((month + 1) % 12 === 0 || month === loanTermMonths - 1) {
                const totalPrincipal = monthlyAmortization.reduce((acc, curr) => acc + curr.principalPayment, 0);
                const totalInterest = monthlyAmortization.reduce((acc, curr) => acc + curr.interestPayment, 0);
                const totalRemainingBalance = monthlyAmortization[monthlyAmortization.length - 1].remainingBalance;
                annualAmortization.push({
                    year: Math.ceil((month + 1) / 12),
                    totalPrincipal,
                    totalInterest,
                    totalRemainingBalance,
                    mortgagePayment
                });
            }

            month++;
        }

        setMonthlyAmortization(monthlyAmortization);
        setAnnualAmortization(annualAmortization);

        const totalAmount = monthlyAmortization.reduce((acc, curr) => acc + curr.mortgagePayment, 0);
        const totalPrincipal = annualAmortization.length > 0 ? annualAmortization[annualAmortization.length - 1].totalPrincipal : 0;
        const totalInterest = annualAmortization.length > 0 ? annualAmortization[annualAmortization.length - 1].totalInterest : 0;

        const principalPercentage = (totalPrincipal / totalAmount) * 100;
        const interestPercentage = (totalInterest / totalAmount) * 100;

        setPrincipalPercentage(principalPercentage);
        setInterestPercentage(interestPercentage);

        renderDoughnutChart(principalPercentage, interestPercentage);
        renderLineChart();
    };

    const renderDoughnutChart = (principalPercentage, interestPercentage) => {
        if (doughnutChartInstance) {
            doughnutChartInstance.destroy();
        }
    
        const ctx = document.getElementById('doughnutChart').getContext('2d');
    
        // Define custom plugin to display percentage values
        const percentagePlugin = {
            id: 'percentagePlugin',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const datasets = chart.data.datasets[0].data;
                const total = datasets.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
                chart.data.labels.forEach((label, index) => {
                    const dataset = datasets[index];
                    const meta = chart.getDatasetMeta(0);
                    const element = meta.data[index];
                    const model = element._model;
                    const startAngle = model.startAngle;
                    const endAngle = model.endAngle;
                    const midAngle = (startAngle + endAngle) / 2;
                    const x = model.x + Math.cos(midAngle) * model.outerRadius * 0.5; // Adjust the percentage text position
                    const y = model.y + Math.sin(midAngle) * model.outerRadius * 0.5; // Adjust the percentage text position
                    const percentage = ((dataset / total) * 100).toFixed(2) + '%';
    
                    ctx.fillStyle = 'black';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 12px Arial';
                    ctx.fillText(percentage, x, y);
                });
            }
        };
    
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    label: 'Principal vs Interest',
                    data: [principalPercentage, interestPercentage],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                width: 350,
                height: 350,
                cutoutPercentage: 41,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            fontFamily: "myriadpro-regular",
                            boxWidth: 15,
                            boxHeight: 2,
                        },
                    },
                    // Include the custom percentage plugin
                    percentagePlugin: percentagePlugin
                }
            }
        });
    
        setDoughnutChartInstance(chart);
    };

    const renderLineChart = () => {

        if (chartInstance) {
            chartInstance.destroy();
        }
        const ctx = document.getElementById('lineChart').getContext('2d');
    
        // Generate labels for the x-axis based on the loan term
        const loanTermYears = parseInt(loanTerm);
        const labels = annualAmortization.map(entry => entry.year);
    
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Principal',
                    data: annualAmortization.map(entry => entry.totalPrincipal),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false // Ensure lines are not filled
                },
                {
                    label: 'Interest',
                    data: annualAmortization.map(entry => entry.totalInterest),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false // Ensure lines are not filled
                },
                {
                    label: 'Balance',
                    data: annualAmortization.map(entry => entry.totalRemainingBalance),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false // Ensure lines are not filled
                }
            ],
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Loan Term (Years)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                }
            }
        };
    
        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });

        setChartInstance(newChartInstance);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        calculateAmortization();
    };

    const handleReset = (event) => {
        event.preventDefault();
        setHomePrice('');
        setDownPaymentPercentage('');
        setInterestRate('');
        setLoanTerm('');
        setLoanAmount('');
        setMonthlyAmortization([]);
        setAnnualAmortization([]);
    };
 
    return ( 
        <div className='containerDad'>
        <div className="containerCalc">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="homePrice">Home Price:</label>
                    <input
                        type="number"
                        id="homePrice"
                        value={homePrice}
                        onChange={(e) => setHomePrice(e.target.value)}
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="downPaymentPercentage">Down Payment (%):</label>
                    <input
                        type="number"
                        id="downPaymentPercentage"
                        value={downPaymentPercentage}
                        onChange={(e) => setDownPaymentPercentage(e.target.value)}
                        min={0}
                        max={100} // Percentage should be between 0 and 100
                        step={0.01} // Example step
                        required
                    />
                </div>
                <div>
                    <label htmlFor="loanAmount">Loan Amount:</label>
                    <div id="loanAmount">{loanAmount}</div>
                </div>
                <div>
                    <label htmlFor="interestRate">Interest Rate (%):</label>
                    <input
                        type="number"
                        id="interestRate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        min={0}
                        max={100} // Example maximum value
                        step={0.01} // Example step
                        required
                    />
                </div>
                <div>
                    <label htmlFor="loanTerm">Loan Term (in years):</label>
                    <input
                        type="number"
                        id="loanTerm"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        min={1}
                        max={35} // Example maximum value
                        required
                    />
                </div>
                <button type="button" onClick={handleReset}>Reset</button>
                <button type="submit">Calculate</button>
            </form>
            </div>

{/*Other side / own div*/}


<div className='popUp'>
<h4 className='amortTitle'>Amortization Details</h4>
            <div className='impData'>
            <div className='textChart'>
    <div className='text-container'>
        <div>Monthly Payment: ${monthlyAmortization.length > 0 ? (monthlyAmortization[0].mortgagePayment || 0).toFixed(2) : '-'}</div>
        <div>Total Interest: ${annualAmortization.length > 0 ? (annualAmortization[annualAmortization.length - 1].totalInterest || 0).toFixed(2) : '-'}</div>
        <div>Total Amount: ${annualAmortization.length > 0 ? ((annualAmortization[annualAmortization.length - 1].totalPrincipal || 0) + (annualAmortization[annualAmortization.length - 1].totalInterest || 0)).toFixed(2) : '-'}</div>
    </div>
    {/* Doughnut chart */}
    <div className='doughnut-chart-container'>
        <canvas id="doughnutChart"></canvas>
    </div>
</div>
{/* Line Chart */}
<div className='line-chart-container'>
<canvas id="lineChart" width="400" height="500"></canvas>
                </div>            
</div>
<br />
            <div>
                    <div onClick={() => setMonthlyDropdownActive(!monthlyDropdownActive)}>Monthly Amortization Schedule</div>
                    <div className={`dropdown-content ${monthlyDropdownActive ? 'active' : ''}`}>
                        <table>
                        <thead>
                        <tr>
                            <th>Month</th>
                            <th>Principal Payment</th>
                            <th>Interest Payment</th>
                            <th>EMI</th>
                            <th>Remaining Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyAmortization.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.month}</td>
                                <td>${entry.principalPayment.toFixed(2)}</td>
                                <td>${entry.interestPayment.toFixed(2)}</td>
                                <td>${(entry.principalPayment + entry.interestPayment).toFixed(2)}</td>
                                <td>${entry.remainingBalance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>                        
                    </table>
                    </div>
                </div>



                <div>
                    <div onClick={() => setAnnualDropdownActive(!annualDropdownActive)}>Annual Amortization Summary</div>
                    <div className={`dropdown-content ${annualDropdownActive ? 'active' : ''}`}>
                        <table>
                        <thead>
                        <tr>
                            <th>Year</th>
                            <th>Total Principal</th>
                            <th>Total Interest</th>
                            <th>Total Remaining Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annualAmortization.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.year}</td>
                                <td>${entry.totalPrincipal.toFixed(2)}</td>
                                <td>${entry.totalInterest.toFixed(2)}</td>
                                <td>${entry.totalRemainingBalance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>                        
                    </table>
                    </div>
                </div>
                </div>
        </div>
    );
}


export default Calculator;

