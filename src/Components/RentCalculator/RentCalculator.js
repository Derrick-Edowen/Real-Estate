import React, { useState } from 'react';
import './Index.css'; // Import your CSS file

const RentCalculator = () => {
  const [income, setIncome] = useState('');
  const [groceries, setGroceries] = useState('0');
  const [clothing, setClothing] = useState('0');
  const [transportation, setTransportation] = useState('0');
  const [utilities, setUtilities] = useState('0');
  const [suggestedRent, setSuggestedRent] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const monthlyExpenses = parseFloat(groceries) + parseFloat(clothing) + parseFloat(transportation) + parseFloat(utilities);
    const totalExpenses = monthlyExpenses || 0; // Ensure total expenses is at least 0
    if (income) {
      const lowRiskRent = income * 0.3 - totalExpenses;
      const midRiskRent = income * 0.45 - totalExpenses;
      const highRiskRent = income * 0.6 - totalExpenses;

      setSuggestedRent({
        lowRisk: lowRiskRent > 0 ? lowRiskRent.toFixed(0) : '0',
        midRisk: midRiskRent > 0 ? midRiskRent.toFixed(0) : '0',
        highRisk: highRiskRent > 0 ? highRiskRent.toFixed(0) : '0'
      });
    } else {
      setSuggestedRent(null);
    }
  };

  return (
    <div className="calculator-container">
      <h1>Rental Affordability Calculator</h1>
      <form onSubmit={handleCalculate}>
        <div className="input-section">
          <label htmlFor="income">Monthly Income ($):</label>
          <input
            type="number"
            id="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your income"
            required
          />
        </div>
        <div className="input-section">
          <label htmlFor="groceries">Groceries ($):</label>
          <input
            type="number"
            id="groceries"
            value={groceries}
            onChange={(e) => setGroceries(e.target.value)}
            placeholder="Enter your groceries expense"
            defaultValue="0"
            required
          />
        </div>
        <div className="input-section">
          <label htmlFor="clothing">Clothing ($):</label>
          <input
            type="number"
            id="clothing"
            value={clothing}
            onChange={(e) => setClothing(e.target.value)}
            placeholder="Enter your clothing expense"
            defaultValue="0"
            required
          />
        </div>
        <div className="input-section">
          <label htmlFor="transportation">Transportation ($):</label>
          <input
            type="number"
            id="transportation"
            value={transportation}
            onChange={(e) => setTransportation(e.target.value)}
            placeholder="Enter your transportation expense"
            defaultValue="0"
            required
          />
        </div>
        <div className="input-section">
          <label htmlFor="utilities">Utilities/Bills ($):</label>
          <input
            type="number"
            id="utilities"
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
            placeholder="Enter your utilities/bills expense"
            defaultValue="0"
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>
      {suggestedRent && (
        <div className="result-box">
          <p>You can afford approximately:</p>
          <ul>
            <li>Low Risk: ${suggestedRent.lowRisk} for rent.</li>
            <li>Mid Risk: ${suggestedRent.midRisk} for rent.</li>
            <li>High Risk: ${suggestedRent.highRisk} for rent.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default RentCalculator;