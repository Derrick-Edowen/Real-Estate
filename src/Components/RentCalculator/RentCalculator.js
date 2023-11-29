import React, { useState } from 'react';
import './Index.css'; // Import your CSS file

const RentCalculator = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [suggestedRent, setSuggestedRent] = useState(null);

  const handleCalculate = () => {
    if (income && expenses) {
      const maxRent = (income * 0.3) - expenses; // Assuming 30% for rent
      setSuggestedRent(maxRent > 0 ? maxRent : 0);
    } else {
      // Handle incomplete data error
      setSuggestedRent(null);
    }
  };

  return (
    <div className="calculator-container">
      <h1>Rental Affordability Calculator</h1>
      <div className="input-section">
        <label htmlFor="income">Monthly Income ($):</label>
        <input
          type="number"
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Enter your income"
        />
      </div>
      <div className="input-section">
        <label htmlFor="expenses">Monthly Expenses ($):</label>
        <input
          type="number"
          id="expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          placeholder="Enter your expenses"
        />
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {suggestedRent !== null && (
        <p className="result">You can afford approximately ${suggestedRent} for rent.</p>
      )}
    </div>
  );
};

export default RentCalculator;