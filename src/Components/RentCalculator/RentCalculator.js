import React, { useState } from 'react';
import './Index.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faLightbulb, faShirt, faCarSide } from '@fortawesome/free-solid-svg-icons';

const RentCalculator = () => {
  const [income, setIncome] = useState('');
  const [groceries, setGroceries] = useState('0');
  const [clothing, setClothing] = useState('0');
  const [transportation, setTransportation] = useState('0');
  const [utilities, setUtilities] = useState('0');
  const [lowRisk, setLowRisk] = useState('');
  const [midRisk, setMidRisk] = useState('');
  const [highRisk, setHighRisk] = useState('');
  const [selectedTips, setSelectedTips] = useState(["Use energy-efficient appliances, LED light bulbs, and smart power strips to reduce electricity consumption",
  "Fix leaks, install water-saving fixtures, and practice water-saving habits like shorter showers",
  "Bundle internet, cable, and phone services from the same provider for discounts",
  "Use a bicycle or walk for short distances instead of driving",
  "Plan meals in advance to avoid impulse purchases and reduce food waste",
  "Purchase non-perishable items in bulk to save money in the long run"]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const monthlyExpenses = parseFloat(groceries) + parseFloat(clothing) + parseFloat(transportation) + parseFloat(utilities);
    if (income) {
      const lowRiskRent = income * 0.3 - monthlyExpenses;
      const midRiskRent = income * 0.4 - monthlyExpenses;
      const highRiskRent = income * 0.5 - monthlyExpenses;
      setLowRisk(lowRiskRent > 0 ? lowRiskRent.toFixed(0) : '0');
      setMidRisk(midRiskRent > 0 ? midRiskRent.toFixed(0) : '0');
      setHighRisk(highRiskRent > 0 ? highRiskRent.toFixed(0) : '0');
      const randomTips = [];
      while (randomTips.length < 6) {
        const randomIndex = Math.floor(Math.random() * tips.length);
        if (!randomTips.includes(tips[randomIndex])) {
          randomTips.push(tips[randomIndex]);
        }
      }
      setSelectedTips(randomTips);
    } else {
      setLowRisk('0');
      setMidRisk('0');
      setHighRisk('0');
      setSelectedTips([]);
    }
  };
const tips = [
"Use energy-efficient appliances, LED light bulbs, and smart power strips to reduce electricity consumption",
"Fix leaks, install water-saving fixtures, and practice water-saving habits like shorter showers",
"Bundle internet, cable, and phone services from the same provider for discounts",
"Use a bicycle or walk for short distances instead of driving",
"Plan meals in advance to avoid impulse purchases and reduce food waste",
"Purchase non-perishable items in bulk to save money in the long run",
"Opt for store brands instead of name brands for significant savings",
"Shop at thrift stores or online second-hand stores for affordable clothing",
"Invest in high-quality, versatile pieces that last longer and can be mixed and matched",
"Use public transportation or carpool to reduce fuel and parking costs",
"Set your thermostat a few degrees lower in winter and higher in summer to save on heating and cooling costs",
"Unplug electronic devices when not in use to avoid standby power consumption",
"Opt for fuel-efficient vehicles or consider switching to electric vehicles to save on fuel costs",
"Use public transportation or carpool with colleagues to split commuting costs"
];
  return (
    <div className='bigHold'>
      <div className="calculator-container">
        <h4 className='rentCalchead'>Rent Affordability Calculator</h4>
        <form onSubmit={handleCalculate}>
  <div className="input-section">
    <label htmlFor="income">Gross Monthly Income ($):</label>
    <div className="dollar-input">
      <input
        type="text"
        id="income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="Enter your income"
        required
      />
    </div>
  </div>
  <br />
  <h5 className='rentCalchead'>Monthly Expenses</h5>
  <div className="input-section">
    <label htmlFor="groceries">Groceries ($):</label>
    <div className="input-with-icon">
      <FontAwesomeIcon icon={faBasketShopping} size="lg" style={{ color: "#ffffff" }} />&nbsp;&nbsp;&nbsp;
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
  </div>
  <div className="input-section">
    <label htmlFor="clothing">Clothing ($):</label>
    <div className="input-with-icon">
      <FontAwesomeIcon icon={faShirt} size="lg" style={{ color: "#ffffff" }} />&nbsp;&nbsp;
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
  </div>
  <div className="input-section">
    <label htmlFor="transportation">Transportation ($):</label>
    <div className="input-with-icon">
      <FontAwesomeIcon icon={faCarSide} size="lg" style={{ color: "#ffffff" }} />&nbsp;&nbsp;
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
  </div>
  <div className="input-section">
    <label htmlFor="utilities">Utilities/Other ($):</label>
    <div className="input-with-icon">
      <FontAwesomeIcon icon={faLightbulb} size="lg" style={{ color: "#ffffff" }} />&nbsp;&nbsp;&nbsp;&nbsp;
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
  </div>
  <button className='rentButton' type="submit">Calculate</button>
</form>
    
      </div>
          <div className="meth">
          
           
        <div className='headie1'>
          <h4 className='rentCalchead1'>Your Rent Affordability</h4>
          <div className='cups'>
            <div className='ppl1'>Recommended Risk Level - ${lowRisk}</div>              

            <div className='ppl2'>Medium Risk Level - ${midRisk}</div>        

            <div className='ppl3'>High Risk Level - ${highRisk}</div>
          </div>
            <br />
                  </div>
              <div className='headie2'>
<h4 className='rentCalchead1'>Expense Reduction Tips</h4>
{selectedTips.map((tip, index) => (
              <div key={index}> - {tip}</div>
            ))}
            </div>
            <div className='riskL'>
            <h4 className='rentCalchead'>Understanding Risk Levels</h4>
            <h5>Recommended Risk (30% of Monthly Income):</h5>

This level is considered low risk because it suggests allocating only 30% of your gross monthly income to rent. It ensures that a significant portion of your income is available for other essential expenses and savings.
Rationale: The 30% threshold is a widely accepted guideline in financial planning. It originated from the U.S. Department of Housing and Urban Development (HUD) as a benchmark for affordable housing costs. It's based on the idea that spending more than 30% of your income on rent may lead to financial stress and difficulty meeting other financial obligations.
<br />
              <br />
              <h5>Medium Risk (40% of Monthly Income):</h5>

This level indicates a moderate risk, suggesting that up to 40% of your gross monthly income can be allocated to rent. While it provides more flexibility, it also reduces the amount available for savings and other expenses.
Rationale: The 40% threshold acknowledges that in some high-cost areas or situations, individuals may need to allocate a higher percentage of their income to rent. However, it also emphasizes the importance of balancing rent affordability with other financial priorities.
              <br />
              <br />
              <h5>High Risk (50% of Monthly Income):</h5>

This level represents a high risk, as it suggests allocating up to 50% of your gross monthly income to rent. While it may be necessary in certain circumstances, such as living in expensive cities, it leaves little room for savings or unexpected expenses.
Rationale: The 50% threshold is a cautionary level, indicating that spending such a significant portion of your income on rent could lead to financial strain. It highlights the importance of exploring alternative housing options or increasing income to reduce this risk.
</div>
            </div>
            </div>

         

          
  );
};
export default RentCalculator;

//    const totalExpenses = monthlyExpenses || 0; // Ensure total expenses is at least 0
