import React, { useEffect, useState } from "react";
import '../../search.css'
import './rentmarket.css'
import axios from 'axios';
import Contact from '../Contact/Contact';
import Chart from 'chart.js/auto';



function MarketRent() {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [marketData, setMarketData] = useState(null);
    const [error, setError] = useState('');
    const [prevYearChart, setPrevYearChart] = useState(null);
    const [currentYearChart, setCurrentYearChart] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2024'); // State for selecting the year
    const [showLoader, setShowLoader] = useState(false); // Control loader visibility

    const handleCityInput = async (e) => {
      const input = e.target.value;
      setCity(input);
  
      if (input.length > 2) {  // Start searching after 3 characters
        try {
          const response = await axios.get('/api/citySuggestions', {
            params: { query: input }
          });
          setSuggestions(response.data.suggestions); // Update with city suggestions from API
        } catch (err) {
          console.error('Error fetching city suggestions:', err);
          setError('Failed to fetch city suggestions. Please try again.');
        }
      } else {
        setSuggestions([]); // Clear suggestions when input is less than 3 characters
      }
    };
  
    const handleCitySelect = async (cityName) => {
      setShowLoader(true);
        setCity(cityName);
        setSuggestions([]);  // Clear suggestions when a city is selected
        
        // Trigger the search automatically after selecting a suggestion
        try {
          const response = await axios.get('/api/marketData', {
            params: { city: cityName },  // Pass the selected city to the API
          });
    
          const marketData = response.data; // Capture the market data response
          setMarketData(marketData); // Set the market data
          if (marketData) {
            setShowLoader(false);
          }
        } catch (error) {
          console.error('Error fetching market data:', error);
          setError('Failed to fetch market data. Please try again.');
        }
      };



      useEffect(() => {
        if (marketData && marketData.medianRentPriceOverTime) {
          const { prevYear, currentYear } = marketData.medianRentPriceOverTime;
      
          if (selectedYear === '2023') {
            prevYear?.length 
              ? renderPrevYearChart(prevYear) 
              : handleNoData('prevYearChart', 'No Data for 2023');
          } else if (selectedYear === '2024') {
            currentYear?.length 
              ? renderCurrentYearChart(currentYear) 
              : handleNoData('currentYearChart', 'No Data for 2024');
          }
        }
      }, [marketData, selectedYear]);
      
      const handleNoData = (canvasId, message) => {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
      };
      
      const renderPrevYearChart = (prevYearData) => {
        if (prevYearChart) {
          prevYearChart.destroy();
          setPrevYearChart(null);
        }
        renderChart('prevYearChart', prevYearData, 'Median Rental Prices - 2023', 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.2)');
      };
      
      const renderCurrentYearChart = (currentYearData) => {
        if (currentYearChart) {
          currentYearChart.destroy();
          setCurrentYearChart(null);
        }
        renderChart('currentYearChart', currentYearData, 'Median Rental Prices - 2024', 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)');
      };
      
      const renderChart = (canvasId, data, label, borderColor, backgroundColor) => {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        const labels = data.map((entry) => `${entry.month} ${entry.year}`);
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: label,
              data: data.map((entry) => entry.price),
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              fill: true,
            },
          ],
        };
      
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Month', color: 'black', font: { size: 14 } },
              ticks: { color: 'black', font: { size: 12 } },
              grid: { color: 'black' },
            },
            y: {
              beginAtZero: false,
              title: { display: true, text: 'Median Rent Price ($)', color: 'black', font: { size: 14 } },
              ticks: { color: 'black', font: { size: 12 } },
              grid: { color: 'black' },
            },
          },
          plugins: {
            legend: {
              labels: { color: 'black', font: { size: 12 } },
            },
          },
        };
      
        const chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: chartOptions,
        });
      
        if (canvasId === 'prevYearChart') setPrevYearChart(chart);
        else setCurrentYearChart(chart);
      };
      
      
return (<>
<div className="mrdata">
<div className="sugs">
<h2 className="typenull">Find Rental Market Data by City</h2>
          <input
            type="text"
            value={city}
            onChange={handleCityInput}
            placeholder="Enter city name"
            className="input citt"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(suggestion)}  // Call handleCitySelect when clicked
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>


<div className="markData">
  {!marketData && showLoader && (
        <div className="loader"></div> // Show loader initially
  )}
{marketData ? (
  <div>
    <div className="typenull2">
      Rental Market Data for: {marketData.areaName || "Area Name Not Available"}<br/>
    </div>
    <div className="sugsBut">
      <button
        className={`prevBu ${selectedYear === '2023' ? 'selected' : ''}`}
        onClick={() => setSelectedYear('2023')}
        disabled={selectedYear === '2023'}
      >
        2023
      </button>
      <button
        className={`currBu ${selectedYear === '2024' ? 'selected' : ''}`}
        onClick={() => setSelectedYear('2024')}
        disabled={selectedYear === '2024'}
      >
        2024
      </button>
    </div>

    {selectedYear === '2023' && (
      <div>
        <canvas id="prevYearChart" width="400" height="400"></canvas>
      </div>
    )}

    {selectedYear === '2024' && (
      <div>
        <canvas id="currentYearChart" width="400" height="400"></canvas>
      </div>
    )}

    {/* Add drop down */}
    <div className="dropindata">
      <div className="toggle-facts-button">
        Rental Market Data Summary - 2024
      </div>
      <div className="additional-facts">
        <div className="descTextF">
          Market Temperature: {marketData?.marketTemperature?.temperature || "N/A"}
        </div>
        <div className="descTextF">
          Median Rent Price: ${marketData?.summary?.medianRent ? marketData.summary.medianRent.toFixed(0) : "N/A"}
        </div>
        <div className="descTextF">
          Highest Priced Rental: ${marketData?.rentHistogram?.maxPrice || "N/A"}
        </div>
        <div className="descTextF">
          Lowest Priced Rental: ${marketData?.rentHistogram?.minPrice || "N/A"}
        </div>
        <div className="descTextF">
          Total Listings: {marketData?.summary?.availableRentals || "No Listings Available"}
        </div>
      </div>
    </div>
  </div>
) : (
  <div></div>
)}





</div>



    </div>
              <Contact />
</>)
}
export default MarketRent;