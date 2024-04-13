import React, { useState, useEffect} from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Indexcalc.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
const [showPopUp2, setShowPopUp2] = useState(false);
const [showScheduleButts, setShowScheduleButts] = useState(false);
const [showDrops, setShowDrops] = useState(false);


    const toggleMonthlyDropdown = () => {
        setMonthlyDropdownActive(!monthlyDropdownActive);
        setAnnualDropdownActive(false);
        setSelectedSchedule('monthly');
      };
      
      // Function to toggle the annual dropdown
      const toggleAnnualDropdown = () => {
        setAnnualDropdownActive(!annualDropdownActive);
        setMonthlyDropdownActive(false);
        setSelectedSchedule('annual');
      };
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
                    borderColor: ['rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                cutoutPercentage: 41,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            fontFamily: "myriadpro-regular",
                            boxWidth: 30,
                            boxHeight: 8,
                            color: 'white',
                    font: {
                        size: 16
                    }
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                        font: {
                            size: 16,
                        },
                    }
                }
            },
            plugins: [ChartDataLabels],
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
                    backgroundColor: 'rgb(255, 99, 132)',
                    fill: false, // Ensure lines are not filled
                    borderDash: [] // Make the line solid

                },
                {
                    label: 'Interest',
                    data: annualAmortization.map(entry => entry.totalInterest),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(54, 162, 235)',
                    fill: false, // Ensure lines are not filled
                    borderDash: [] // Make the line solid

                },
                {
                    label: 'Balance',
                    data: annualAmortization.map(entry => entry.totalRemainingBalance),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgb(75, 192, 192)',
                    fill: false, // Ensure lines are not filled
                    borderDash: [] // Make the line solid

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
                        text: 'Loan Term (Years)',
                        color: 'white',
                        font: {
                            size: 20,
                        }
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMin: 0, // Ensure y-axis starts at 0
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        color: 'white',
                        font: {
                            size: 20,
                        }
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16
                        }
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
    toggleMonthlyDropdown(); // Ensure monthly dropdown is inactive
    setMonthlyDropdownActive(false);
    setAnnualDropdownActive(true); // Activate annual dropdown
    setShowPopUp(true);
    setShowPopUp2(true);
    setShowScheduleButts(true);
    setShowDrops(true);

    };

    const handleReset = (event) => {
        event.preventDefault();
        setShowPopUp(false);
    setShowPopUp2(false);
    setShowScheduleButts(false);
    setShowDrops(false);

        setHomePrice('');
        setDownPaymentPercentage('');
        setInterestRate('');
        setLoanTerm('');
        setLoanAmount('');
        setMonthlyAmortization([]);
        setAnnualAmortization([]);
    };
    const formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const downloadPDF = () => {
        const doc = new jsPDF();
        
        // Add monthly table
        doc.text('Monthly Amortization Schedule', 10, 10);
        doc.autoTable({ html: '#monthlyTable', startY: 15 });
        
        // Add annual table
        doc.text('Annual Amortization Summary', 10, doc.autoTable.previous.finalY + 10);
        doc.autoTable({ html: '#annualTable', startY: doc.autoTable.previous.finalY + 15 });
        
        doc.save('Amortization_Schedules.pdf');
      };

    const monthlyClass = monthlyDropdownActive ? '' : 'inactive';
    const annualClass = annualDropdownActive ? '' : 'inactive';
    return ( 
        <div className='containerDad'>
        <div className="containerCalc">
            
        <form className='calcForm' onSubmit={handleSubmit}>
        <h4 className='amortTitle'>Amortization Calculator</h4>
        <div  className='littlePlan'>
    <div className="form-row">
        <div className="form-group">
            <label className='simpin' htmlFor="homePrice">Home Price ($):</label>
            <input
                type="number"
                id="homePrice"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                min={1}
                required
            />
        </div>
        <div className="form-group">
            <label className='simpin' htmlFor="downPaymentPercentage">Down Payment (%):</label>
            <input
                type="number"
                id="downPaymentPercentage"
                value={downPaymentPercentage}
                onChange={(e) => setDownPaymentPercentage(e.target.value)}
                min={0}
                max={99} // Percentage should be between 0 and 100
                step={0.01} // Example step
                required
            />
        </div>
    </div>
    <div className="form-row">
        <div className="form-group">
            <label className='simpin' htmlFor="interestRate">Interest Rate (%):</label>
            <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min={0}
                max={99} // Example maximum value
                step={0.01} // Example step
                required
            />
        </div>
        <div className="form-group">
            <label className='simpin' htmlFor="loanTerm">Loan Term (in years):</label>
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
    </div>
    <div className="form-row">
        <div className="form-group full-width">
            <label className='simpin' htmlFor="loanAmount">Loan Amount ($):</label>
            <div className="input-like" id="loanAmount">{loanAmount}</div>
        </div>
    </div>
    </div>
    <div className="form-actions">
        <button className='resetCalc' type="button" onClick={handleReset}>Reset</button>
        <button  className='calculate' type="submit">Calculate</button>
    </div>
</form>


            </div>


{/*Other side / own div*/}


<div className='popUp' style={{ display: showPopUp ? 'block' : 'none' }}>
            <div className='impData'>
            <h4 className='amortTitle'>Equated Monthly Instalment (EMI) Details</h4>

            <div className='textChart'>
    <div className='text-container'>
    <div className='monPay'>Monthly Payment: ${formatNumberWithCommas(monthlyAmortization.length) > 0 ? formatNumberWithCommas((monthlyAmortization[0].mortgagePayment || 0).toFixed(2)) : '-'}</div>
    <div className='monPay3'>Home Price: ${formatNumberWithCommas(homePrice)}</div>
    <div className='monPay3'>Down Payment: ${formatNumberWithCommas((homePrice * downPaymentPercentage / 100).toFixed(0))}</div>
    <div className='monPay3'>Loan Amount: ${formatNumberWithCommas(loanAmount)}</div>
    <div className='monPay2'>Total Interest: ${formatNumberWithCommas(annualAmortization.length) > 0 ? formatNumberWithCommas((annualAmortization[annualAmortization.length - 1].totalInterest || 0).toFixed(2)) : '-'}</div>
    <div className='monPay3'>Total Amount: ${formatNumberWithCommas(annualAmortization.length) > 0 ? formatNumberWithCommas(((annualAmortization[annualAmortization.length - 1].totalPrincipal || 0) + (annualAmortization[annualAmortization.length - 1].totalInterest || 0)).toFixed(2)) : '-'}</div>
    </div>
    {/* Doughnut chart */}
    <div className='doughnut-chart-container'>
        <canvas id="doughnutChart" width="250" height="200"></canvas>
    </div>
</div>
         
</div>

                </div>
                {/* Line Chart */}
                <div className='popUp2' style={{ display: showPopUp2 ? 'block' : 'none' }}>
                <h4 className='amortTitle'>Annual Amortization Graph</h4>
<div className='line-chart-container'>
<canvas id="lineChart" width="300" height="415"></canvas>
                </div>   
                </div>




                <div className='tableHold'>
<div className='scheduleButts' style={{ display: showScheduleButts ? 'block' : 'none' }}>
    <button className={`annual ${annualClass}`} onClick={toggleAnnualDropdown}   disabled={annualClass !== 'inactive'} // Disable if the annualClass is 'active'
>
        Annual Schedule
        </button>
    <button className={`month ${monthlyClass}`} onClick={toggleMonthlyDropdown}   disabled={monthlyClass !== 'inactive'} // Disable if the monthlyClass is 'active'
>
        Monthly Schedule
    </button>
    <button className='downPDF' onClick={downloadPDF}><FontAwesomeIcon icon={faFilePdf} size="lg"/>


    </button>
</div>




<div className='drops' style={{ display: showDrops ? 'block' : 'none' }}>
            <div>
      <div className={`dropdown-contentCalc ${monthlyDropdownActive ? 'active' : ''}`}>
                        <table id='monthlyTable'>
                        <thead>
                        <tr>
                            <th>Month</th>
                            <th>Principal Payment</th>
                            <th>Interest Payment</th>
                            <th>Monthly Payment</th>
                            <th>Remaining Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyAmortization.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.month}</td>
                                <td>${formatNumberWithCommas(entry.principalPayment.toFixed(2))}</td>
                                <td>${formatNumberWithCommas(entry.interestPayment.toFixed(2))}</td>
                                <td>${formatNumberWithCommas((entry.principalPayment + entry.interestPayment).toFixed(2))}</td>
                                <td>${formatNumberWithCommas(entry.remainingBalance.toFixed(2))}</td>
                            </tr>
                        ))}
                    </tbody>                        
                    </table>
                    </div>
                </div>
                <div>
      <div className={`dropdown-contentCalc ${annualDropdownActive ? 'active' : ''}`}>
                        <table id="annualTable">
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
                                <td>${formatNumberWithCommas(entry.totalPrincipal.toFixed(2))}</td>
                                <td>${formatNumberWithCommas(entry.totalInterest.toFixed(2))}</td>
                                <td>${formatNumberWithCommas(entry.totalRemainingBalance.toFixed(2))}</td>
                            </tr>
                        ))}
                    </tbody>                        
                    </table>
                    </div>
                </div>
                </div>




</div>
                
        </div>
    );
}


export default Calculator;

