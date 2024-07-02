import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import noImg from '../../Assets/Images/noimg.jpg'
import '../../search.css'
import './propDetails.css'
import { useParams, useLocation } from 'react-router-dom';
import Contact from '../Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowLeft, faArrowRight, faChevronDown, faCircle, faEye, 
  faBasketShopping, faLightbulb, faShirt, faCarSide, faDollarSign } from '@fortawesome/free-solid-svg-icons';
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
const PropertyDetails = () => {
    const { address } = useParams();
  
    const [property, setProperty] = useState(null);
    const [infoData, setInfoData] = useState({});
    const [api, setApi] = useState(null);
    const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
    const [zoomLevel, setZoomLevel] = useState(11);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const [visibleComponent, setVisibleComponent] = useState('map');
    const [showAdditionalFacts, setShowAdditionalFacts] = useState(false);
    const [showNearbyHomes, setShowNearbyHomes] = useState(true); // State to control visibility of Nearby Homes
    const [rent, setRent] = useState('');
    const [income, setIncome] = useState('');
    const [groceries, setGroceries] = useState(0);
    const [utilities, setUtilities] = useState(0);
    const [clothing, setClothing] = useState(0);
    const [transportation, setTransportation] = useState(0);
  
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
    
    useEffect(() => {
        const pathname = window.location.pathname;
        const storageKey = pathname.includes('/Nearby-Property-Details/') ? 'nearbyData' : 'propertyData';
        
        const storedData = sessionStorage.getItem(storageKey);
        if (storedData) {
            const data = JSON.parse(storedData);
            setProperty(data.property);
            setInfoData(data.info);
            setApi(data.api);
            console.log("Property Data:", data.property);
            console.log("Info Data:", data.info);
            console.log("API Data:", data.api);


            const fullAddress = `${safeAccess(data.api, 'address.streetAddress')} ${safeAccess(data.api, 'address.zipcode')} ${safeAccess(data.api, 'address.city')} ${safeAccess(data.api, 'address.state')}`;
            updateMapLocation(fullAddress);
        }

        // Check URL for /Nearby-Property-Details/ to disable Nearby Homes button
        setShowNearbyHomes(!pathname.includes('/Nearby-Property-Details/'));
    }, []);
  
    function safeAccess(obj, path) {
        if (!path || typeof path !== 'string') {
          return "Undisclosed";
        }
        return path.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : "Undisclosed"), obj);
      }

    const formatNumberWithCommas = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  
    const handleCloseLightbox = () => {
      window.close();
    };
    const handleMissClick = (component) => {
        setVisibleComponent(component);
      };
    const handlePrevImage = () => {
      const prevIndex = (currentImageIndex - 1 + infoData.images.length) % infoData.images.length;
      setCurrentImageIndex(prevIndex);
    };
  
    const handleNextImage = () => {
      const nextIndex = (currentImageIndex + 1) % infoData.images.length;
      setCurrentImageIndex(nextIndex);
    };
    const toggleAdditionalFacts = () => {
        setShowAdditionalFacts(!showAdditionalFacts);
      };
      const handleContactClick = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      };
    const updateMapLocation = async (address) => {
      try {
        const response = await fetch('/api/geocode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        const { results, status } = data;
        if (status === 'OK' && results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          setPosition({ lat, lng });
          setZoomLevel(16); // Set your desired zoom level here
        } else {
          window.alert('Location Not Found: Try Using More Descriptive Words!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    
    const schools = safeAccess(api, 'schools', []);
    const history = safeAccess(api, 'priceHistory', []); // Assuming api.priceHistory is where price history data resides
    const nearbyHomes = safeAccess(api, 'nearbyHomes', []);
    const monthlyPrice = safeAccess(api, 'price', 0);
    const yearlyPrice = monthlyPrice * 12;
    const hasPetsAllowed = safeAccess(api, 'resoFacts.hasPetsAllowed');
const garage = safeAccess(api, 'resoFacts.hasGarage');
const furnished = safeAccess(api, 'resoFacts.furnished');
const homeType = safeAccess(api, 'homeType')?.replace(/_/g, ' '); // Replace underscores with spaces
const homeStatus = safeAccess(api, 'homeStatus')?.replace(/_/g, ' '); // Replace underscores with spaces

useEffect(() => {
  const calculateIncome = (rent, expenses) => {
    const monthlyRent = parseFloat(rent);
    const monthlyExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr), 0);
    const annualRentAndExpenses = (monthlyRent + monthlyExpenses) * 12;
    const requiredIncome = annualRentAndExpenses / 0.3;
    return requiredIncome.toFixed(0);
  };

  const handleCalculate = () => {
    if (rent) {
      const expenses = [groceries, utilities, clothing, transportation];
      const result = calculateIncome(rent, expenses);
      setIncome(result);
    }
  };

  handleCalculate();
}, [rent, groceries, utilities, clothing, transportation]);

useEffect(() => {
  setRent(monthlyPrice);
}, [monthlyPrice]);
const handleNearClick = async (zpid) => {

  try {
      const response = await fetch('/nearby-details', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ zpid })
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const propertyDetails = await response.json();
      console.log('Property details:', propertyDetails); // Debugging

      // Construct the address and URL
      const property = propertyDetails.property;
      const images = propertyDetails.images; // Corrected here
      const address = `${safeAccess(property, 'address.streetAddress')} ${safeAccess(property, 'address.zipcode')} ${safeAccess(property, 'address.city')} ${safeAccess(property, 'address.state')}`;
      const urlAddress = encodeURIComponent(address.replace(/\s+/g, '-').toLowerCase());
  
      const nearbyData = {
          property: property,
          info: images,
          api: property
      };
  
      sessionStorage.setItem('nearbyData', JSON.stringify(nearbyData));
  
      const url = `/Nearby-Property-Details/${urlAddress}`;
      window.open(url, '_blank');
  } catch (error) {
      console.error('Error fetching property details:', error.message);
  }
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
    return (
        <>
      <div className='propDets'>
        {api && (
          <>
            <div className='aver'>
              <div className='pAddress-1 notranslate'>
                {safeAccess(api, 'address.streetAddress')} <br/>
                  {safeAccess(api, 'address.city') + " , " + safeAccess(api, 'address.state') + " " + safeAccess(api, 'address.zipcode') }
                  &nbsp;<FontAwesomeIcon icon={faLocationDot} />
              </div>
            </div>
            <div className='side-by-side-container notranslate'>
              <div className='fixer notranslate'>
                <button className="lightbox-left notranslate" onClick={handlePrevImage}>
                <FontAwesomeIcon icon={faArrowLeft} style={{color: "#ffffff",}} />
                                </button>
                <img className='fixImage' src={infoData.images ? infoData.images[currentImageIndex] : noImg} alt="Sorry, Image Unavailable!" />
                <button className="lightbox-right notranslate" onClick={handleNextImage}>
                <FontAwesomeIcon icon={faArrowRight} style={{color: "#ffffff",}} />                
                </button>
                <div className='cardAsk notranslate'>Listing provided courtesy of: {safeAccess(api, 'brokerageName')}</div>
  
              </div>
              <div className="cardText notranslate">
                <div className='containText notranslate'>
                {homeStatus === 'FOR RENT' && (
    <>
      <div className='pPrice notranslate'>
        ${formatNumberWithCommas(monthlyPrice)} <span className='currency'>{safeAccess(api, 'currency')}/Month</span>
      </div>
      <div className='pminiPrice notranslate'>
        Est. ${formatNumberWithCommas(yearlyPrice)} annually
      </div>
    </>
  )}
                  {homeStatus !== 'FOR RENT' && (
    <>
      <div className='pPrice notranslate'>
        ${formatNumberWithCommas(monthlyPrice)} <span className='currency'>{safeAccess(api, 'currency')}</span>
      </div>
    </>
  )}
                    <div className='bedd'>{safeAccess(api, 'bedrooms')}&nbsp;Bed(s)</div>
                    <div className='bathh'>{safeAccess(api, 'bathrooms')}&nbsp;Bath(s)</div>
                  <div className='dayss'><FontAwesomeIcon icon={faCircle} style={{color: "#00a303",}} /> Active ({safeAccess(api, 'timeOnZillow')})</div>
                  <div className='holding1 notranslate'>

                  <div className='descTextQ notranslate'>MLS&reg;: {safeAccess(api, 'mlsid')}</div>
                  <div className='descTextQ notranslate'><FontAwesomeIcon icon={faEye} />&nbsp;Views: {safeAccess(api, 'pageViewCount')}</div>
                  <button className='contact-button' onClick={handleContactClick}>Contact</button>
                  </div>
                </div>
              </div>
            </div>
            <div className='mr'>
        <div className='detts'>Property Details</div>
        <div className='descText notranslate'>{safeAccess(api, 'description')}</div>
        <div className='toggle-facts-button' onClick={toggleAdditionalFacts}>
        {showAdditionalFacts ? 'Hide Additional Property Facts' : 'View Additional Property Facts'} 
        <span className={`chevy ${showAdditionalFacts ? 'rotate' : ''}`}><FontAwesomeIcon icon={faChevronDown} style={{color: "#032868",}}  
          /></span>        </div>
          <div>* U = Undisclosed Information </div>
        {showAdditionalFacts && (
          <div className='additional-facts'>
            <div className='descTextF notranslate'>Heating - {safeAccess(api, 'resoFacts.heating.0')}</div>
            <div className='descTextF notranslate'>Cooling - {safeAccess(api, 'resoFacts.cooling.0')}</div>
            <div className='descTextF notranslate'>Allocated Parking Spaces - {safeAccess(api, 'resoFacts.parkingCapacity')}</div>
            <div className='descTextF notranslate'>Flooring Type - {safeAccess(api, 'resoFacts.flooring.0')}</div>
            <div className='descTextF notranslate'>Pets Allowed - {hasPetsAllowed === true ? 'Yes' : 'No'}</div>
            <div className='descTextF notranslate'>Garage - {garage === true ? 'Yes' : 'No'}</div>
            <div className='descTextF notranslate'> Laundry - {safeAccess(api, 'resoFacts.laundryFeatures.0')}</div>
            <div className='descTextF notranslate'> Furnished - {furnished === true ? 'Yes' : 'No'}</div>
            <div className='descTextF notranslate'> Stories/Levels - {safeAccess(api, 'resoFacts.stories')}</div>
            <div className='descTextF notranslate'> Square Footage - {safeAccess(api, 'resoFacts.livingArea')}</div>
            <div className='descTextF notranslate'> Home Type - {homeType}</div>
            <div className='descTextF notranslate'> County - {safeAccess(api, 'county')}</div>
            <div className='descTextF notranslate'>Built in: {safeAccess(api, 'yearBuilt')}</div>

          </div>
        )}
      </div>
          </>
        )}
    <div className='general'>
    <div className="buttonp-container">
        <button
          className={`toggle-button ${visibleComponent === 'map' ? 'active' : ''}`}
          onClick={() => handleMissClick('map')}
        >
          Map
        </button>
        <button
          className={`toggle-button ${visibleComponent === 'schools' ? 'active' : ''}`}
          onClick={() => handleMissClick('schools')}
        >
          Schools
        </button>
        <button
    className={`toggle-button ${visibleComponent === 'homes' ? 'active' : ''} ${window.location.pathname.includes(`/Nearby-Property-Details/`) ? 'disabled' : ''}`}
    onClick={() => handleMissClick('homes')}
    disabled={window.location.pathname.includes(`/Nearby-Property-Details/`)}
>
    Nearby Homes
</button>
<button
          className={`toggle-button ${visibleComponent === 'history' ? 'active' : ''}`}
          onClick={() => handleMissClick('history')}
        >
          Price History
        </button>
      </div>
      {visibleComponent === 'map' && (
        <div className="map">
          <APIProvider apiKey={apiKey}>
            <Map center={position} zoom={zoomLevel} mapTypeId ='hybrid' style={{ width: '100%', height: '450px' }}>
              <Marker position={position} />
            </Map>
          </APIProvider>
        </div>
      )}
      {visibleComponent === 'schools' && (
        <div className="schools">
        {schools.length > 0 ? (
          schools.map((school, index) => (
            <a
        key={index}
        href={school.link}
        target="_blank"
        rel="noopener noreferrer"
        className="school-card-link descTextF"
      >
        <div className="school-card">
          <div><strong>Name:</strong> {school.name}</div>
          <div><strong>Type:</strong> {school.type}</div>
          <div><strong>Level:</strong> {school.level}</div>
          <div><strong>Grades:</strong> {school.grades}</div>
          <div><strong>Distance:</strong> {school.distance}</div>
          <div><strong>Rating:</strong> {school.rating}</div>
        </div>
      </a>
          ))
        ) : (
          <div className='noSchool'>No Local School Data Available!</div>
        )}
      </div>
      )}
      {visibleComponent === 'homes' && (
        <div className="nearby-homes">
      {nearbyHomes.length > 0 ? (
      nearbyHomes.map((home, index) => (
        <div
          className="home-card"
          key={index}
          style={{ backgroundImage: `url(${home.miniCardPhotos[0]?.url || 'default-image-url'})` }}
          alt='No Image Available'
          onClick={() => handleNearClick(home.zpid)}  // Handle card click
        >
          <div className="home-card-content">
            <div className="home-address">
              {home.address.streetAddress} {home.address.zipcode} {home.address.city}, {home.address.state}
            </div>
            <div className="home-price">
              ${formatNumberWithCommas(home.price)}
            </div>
          </div>
          <div className="home-card-overlay">View Nearby Home Details</div>
        </div>
      ))
    ) : (
      <div className='noSchool'>No Nearby Homes Found!</div>
    )}
    </div>
      )}
{visibleComponent === 'history' && (
  <div className="history">
    {history && history.length > 0 ? (
      history.map((historyItem, index) => (
        <div className="history-card descTextF" key={index}>
          <div><strong>Price:</strong> ${historyItem.price}</div>
          <div><strong>Event:</strong> {historyItem.event}</div>
          <div><strong>Date:</strong> {historyItem.date}</div>
        </div>
      ))
    ) : (
      <div className='noSchool'>Pricing History Not Available!</div>
    )}
      </div>
      )}

    </div>
    {homeStatus === 'FOR RENT' && (
    <div className="calculatorpd-container">
      <div className='descTextF' >Rent Affordability Calculation</div>
      <div className='resultdis'>* This Rent Affordability Calculator follows the 30% rule. Most experts traditionally 
      recommended people not spend more than 30% of their gross (before tax) income on housing costs (such as rent, utilities, etc.).</div>
    <label htmlFor="rent" className='descTex'>Monthly Rent ($):</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faDollarSign} size="lg" style={{color: "#006102",}} />&nbsp;&nbsp; <input
          type="number"
          id="rent"
          className='innie'
          min={0}
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />
      </div>
      <label htmlFor="groceries" className='descTex'>Groceries ($):</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faBasketShopping} size="lg" style={{ color: "#003c8a" }} />&nbsp;&nbsp; <input
          type="number"
          id="groceries"
          className='innie'
min={0}
defaultValue={0}

          value={groceries}
          onChange={(e) => setGroceries(e.target.value)}
        />
      </div>
      <label htmlFor="utilities" className='descTex'>Utilities/Other ($):</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faLightbulb} size="lg" style={{ color: "#441b00" }} />&nbsp;&nbsp; <input
          type="number"
          id="utilities"
          className='innie'
          min={0}
          defaultValue={0}

          value={utilities}
          onChange={(e) => setUtilities(e.target.value)}
        />
      </div>
      <label htmlFor="clothing" className='descTex'>Clothing ($):</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faShirt} size="lg" style={{ color: "#1e0030fc" }} />&nbsp;&nbsp; <input
          type="number"
          id="clothing"
          className='innie'
          min={0}
          defaultValue={0}

          value={clothing}
          onChange={(e) => setClothing(e.target.value)}
        />
      </div>
      <label htmlFor="transportation" className='descTex'>Transportation ($):</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faCarSide} size="lg" style={{ color: "#660101" }} />&nbsp;&nbsp; <input
          type="number"
          id="transportation"
          className='innie'
          min={0}
          defaultValue={0}

          value={transportation}
          onChange={(e) => setTransportation(e.target.value)}
        />
      </div>
      {income && (
        <div className="result">
            <div className='descTextF'>Recommended Gross Monthly Income: ${formatNumberWithCommas((income / 12).toFixed(0))}</div>
            <div className='descTextF'>Recommeded Gross Annual Income: ${formatNumberWithCommas(income)}</div>
        </div>
      )}
    </div>
    )}






        {homeStatus !== 'FOR RENT' && (
    <div className="mortgagepd-container">
    <div className='descTextF'>Amortization Calculator</div>
    <label htmlFor="homePrice" className='descTex'>Home Price($):</label>
    <div className="input-group">
        <input
            type="number"
            id="homePrice"
            className='innie'
            min={0}
            onChange={(e) => setHomePrice(e.target.value)}
        />
    </div>
    <label htmlFor="downPaymentPercentage" className='descTex'>Down Payment Percentage:</label>
    <div className="input-group">
        <input
            type="number"
            id="downPaymentPercentage"
            className='innie'
            min={0}
            onChange={(e) => setDownPaymentPercentage(e.target.value)}
        />
    </div>
    <label htmlFor="interestRate" className='descTex'>Interest Rate (%):</label>
    <div className="input-group">
        <input
            type="number"
            id="interestRate"
            className='innie'
            min={0}
            onChange={(e) => setInterestRate(e.target.value)}
        />
    </div>
    <label htmlFor="loanTerm" className='descTex'>Loan Term (Years):</label>
    <div className="input-group">
        <input
            type="number"
            id="loanTerm"
            className='innie'
            min={0}
            onChange={(e) => setLoanTerm(e.target.value)}
        />
    </div>
</div>
)}










      </div>
</>
    );
  };
  
  export default PropertyDetails;
