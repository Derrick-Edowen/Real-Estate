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
        setCity(cityName);
        setSuggestions([]);  // Clear suggestions when a city is selected
        
        // Trigger the search automatically after selecting a suggestion
        try {
          const response = await axios.get('/api/marketData', {
            params: { city: cityName },  // Pass the selected city to the API
          });
    
          const marketData = response.data; // Capture the market data response
          setMarketData(marketData); // Set the market data
          console.log('Market Data:', marketData);
        } catch (error) {
          console.error('Error fetching market data:', error);
          setError('Failed to fetch market data. Please try again.');
        }
      };



      useEffect(() => {
        if (marketData && marketData.medianRentPriceOverTime) {
          if (selectedYear === '2023') {
            renderPrevYearChart(marketData.medianRentPriceOverTime.prevYear);
          } else if (selectedYear === '2024') {
            renderCurrentYearChart(marketData.medianRentPriceOverTime.currentYear);
          }
        }
      }, [marketData, selectedYear]); // Run when marketData or selectedYear changes
    
      const renderPrevYearChart = (prevYearData) => {
        if (prevYearChart) {
          prevYearChart.destroy();
          setPrevYearChart(null);
        }
    
        const canvas = document.getElementById('prevYearChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const labels = prevYearData.map((entry) => `${entry.month} ${entry.year}`);
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Median Rental Prices - 2023',
              data: prevYearData.map((entry) => entry.price),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            }
          ]
        };
    
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: 'black',
                font: {
                  size: 14,
                }
              },
              ticks: {
                color: 'black',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'black'
              }
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Median Rent Price ($)',
                color: 'black',
                font: {
                  size: 14,
                }
              },
              ticks: {
                color: 'black',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'black'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'black',
                font: {
                  size: 12
                }
              }
            }
          }
        };
    
        const newPrevYearChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: chartOptions,
        });
    
        setPrevYearChart(newPrevYearChart);
      };
    
      const renderCurrentYearChart = (currentYearData) => {
        if (currentYearChart) {
          currentYearChart.destroy();
          setCurrentYearChart(null);
        }
    
        const canvas = document.getElementById('currentYearChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const labels = currentYearData.map((entry) => `${entry.month} ${entry.year}`);
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Median Rental Prices - 2024',
              data: currentYearData.map((entry) => entry.price),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
            }
          ]
        };
    
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: 'black',
                font: {
                  size: 14,
                }
              },
              ticks: {
                color: 'black',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'black'
              }
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Median Rent Price ($)',
                color: 'black',
                font: {
                  size: 14,
                }
              },
              ticks: {
                color: 'black',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'black'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'black',
                font: {
                  size: 12
                }
              }
            }
          }
        };
    
        const newCurrentYearChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: chartOptions,
        });
    
        setCurrentYearChart(newCurrentYearChart);
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
{/* Add displayed code here*/}

{marketData ? (
    <div>
        <div className="typenull2">
            Rental Market Data for: {marketData.areaName}<br/>
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

      {/* Add drop down*/}
<div className="dropindata">
    <div className="toggle-facts-button">
      Rental Market Data Summary
    </div>
    <div className="additional-facts">
    <div className="descTextF">
        Market Temperature: {marketData?.marketTemperature.temperature}
      </div>
      <div className="descTextF">
        Median Rent Price: ${(marketData?.summary.medianRent).toFixed(0)}
      </div>
      <div className="descTextF">
        Highest Priced Rental: ${marketData?.rentHistogram.maxPrice}
      </div>
      <div className="descTextF">
        Lowest Priced Rental: ${marketData?.rentHistogram.minPrice}
      </div>
      <div className="descTextF">
        Total Listings: {marketData?.summary.availableRentals}
      </div>

    </div>
</div>
              </div>
) : (
    <div className="descTextJfc"></div>
)}




</div>



    </div>
              <Contact />
</>)
}
export default MarketRent;