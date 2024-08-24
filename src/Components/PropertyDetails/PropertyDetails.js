import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import noImg from '../../Assets/Images/noimg.jpg'
import '../../search.css'
import './propDetails.css'
import { useParams, useLocation } from 'react-router-dom';
import Contact from '../Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowLeft, faArrowRight, faChevronDown, faCircleCheck, faEye, 
  faBasketShopping, faLightbulb, faShirt, faCarSide, faDollarSign } from '@fortawesome/free-solid-svg-icons';
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
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
    const [monthPrice, setMonthPrice] = useState('');

    const [income, setIncome] = useState('');
    const [groceries, setGroceries] = useState(0);
    const [utilities, setUtilities] = useState(0);
    const [clothing, setClothing] = useState(0);
    const [transportation, setTransportation] = useState(0);
    const [homePrice, setHomePrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
    const [interestRate, setInterestRate] = useState(6);
    const [loanTerm, setLoanTerm] = useState(20);
    const [loanAmount, setLoanAmount] = useState('');
    const [monthlyAmortization, setMonthlyAmortization] = useState([]);
    const [annualAmortization, setAnnualAmortization] = useState([]);
    const [doughnutChartInstance, setDoughnutChartInstance] = useState(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
      const pathname = window.location.pathname;
      const storageKey = pathname.includes('/Nearby-Property-Details/') ? 'nearbyData' : 'propertyData';
      
      const storedData = sessionStorage.getItem(storageKey);
      if (storedData) {
          const data = JSON.parse(storedData);
          setProperty(data.property);
          setInfoData(data.info);
          setApi(data.property);
          const fullAddress = `${safeAccess(data.property, 'address.streetAddress')} ${safeAccess(data.property, 'address.zipcode')} ${safeAccess(data.property, 'address.city')} ${safeAccess(data.property, 'address.state')}`;
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
    const monthlyPrice = safeAccess(api, 'price', 0);
    const schools = safeAccess(api, 'schools', []);
    const history = safeAccess(api, 'priceHistory', []); // Assuming api.priceHistory is where price history data resides
    const nearbyHomes = safeAccess(api, 'nearbyHomes', []);
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
useEffect(() => {
  if (homeStatus === "FOR RENT") {
    return; // Skip the mortgage calculation when homeStatus is "FOR RENT"
  }
  setHomePrice(monthlyPrice);
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
useEffect(() => {
  if (homeStatus === "FOR RENT") {
    return; // Skip the mortgage calculation when homeStatus is "FOR RENT"
  }
  // Calculate loan amount and amortization schedules
  const downPayment = (homePrice * downPaymentPercentage) / 100;
  const loanAmount = homePrice - downPayment;
  setLoanAmount(loanAmount);
  
  if (interestRate > 0 && loanTerm > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const monthlyAmortization = [];
      const annualAmortization = [];
      let balance = loanAmount;
      let totalInterest = 0;

      for (let i = 0; i < numberOfPayments; i++) {
          const interest = balance * monthlyRate;
          const principal = monthlyPayment - interest;
          balance -= principal;
          totalInterest += interest;
          monthlyAmortization.push({ month: i + 1, interest, principal, balance, mortgagePayment: monthlyPayment });

          if ((i + 1) % 12 === 0 || i === numberOfPayments - 1) {
              const year = Math.ceil((i + 1) / 12);
              const totalPrincipal = loanAmount - balance;
              const totalRemainingBalance = balance;
              const annualPayment = monthlyPayment * 12;
              annualAmortization.push({ year, totalInterest, totalPrincipal, annualPayment, totalRemainingBalance });
          }
      }

      setMonthlyAmortization(monthlyAmortization);
      setAnnualAmortization(annualAmortization);

      // Render charts
      const totalPrincipal = loanAmount;
      const principalPercentage = (totalPrincipal / (totalPrincipal + totalInterest)) * 100;
      const interestPercentage = (totalInterest / (totalPrincipal + totalInterest)) * 100;
      renderDoughnutChart(principalPercentage, interestPercentage);
      renderLineChart(annualAmortization);

  }
}, [homePrice, downPaymentPercentage, interestRate, loanTerm]);



const renderDoughnutChart = (principalPercentage, interestPercentage) => {
  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
    setDoughnutChartInstance(null); // Clear the chart instance
  }

  // Clear the canvas element to ensure it's not reused incorrectly
  const canvas = document.getElementById('doughnutChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)'
        ],
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



const renderLineChart = (annualAmortization) => {
  if (chartInstance) {
    chartInstance.destroy();
    setChartInstance(null); // Clear the chart instance
  }

  // Clear the canvas element to ensure it's not reused incorrectly
  const canvas = document.getElementById('lineChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = annualAmortization.map(entry => entry.year);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Principal',
        data: annualAmortization.map(entry => entry.totalPrincipal),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        fill: false
      },
      {
        label: 'Interest',
        data: annualAmortization.map(entry => entry.totalInterest),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgb(54, 162, 235)',
        fill: false
      },
      {
        label: 'Balance',
        data: annualAmortization.map(entry => entry.totalRemainingBalance),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
        fill: false
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
        beginAtZero: true,
        suggestedMin: 0,
        title: {
          display: true,
          text: 'Amount ($)',
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

  const newChartInstance = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions
  });

  setChartInstance(newChartInstance);
};


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
useEffect(() => {
  const initializeAds = () => {
    if (window.adsbygoogle) {
      window.adsbygoogle.loaded = true;
      for (let i = 0; i < 8; i++) {
        window.adsbygoogle.push({});
      }
    }
  };
  
  const timeoutId = setTimeout(initializeAds, 1000); // Push ads 1 second after page load
  return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
}, []);
    return (
        <>
<aside className="leftSidebar">
<ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="1751608205"></ins>
            </aside>
      <main className='propDets'>
        {api && (
          <>
            <div className='aver'>
              <div className='pAddress-1 notranslate'>
                {safeAccess(api, 'address.streetAddress')+ " " + safeAccess(api, 'address.city') + " , " + safeAccess(api, 'address.state') + " " + safeAccess(api, 'address.zipcode') }
                  &nbsp;<FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div className='descTextM notranslate'>MLS&reg;: {safeAccess(api, 'mlsid')} | {homeStatus}</div>
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
                <div className='cardAsk descTex notranslate'>Listing provided courtesy of: {safeAccess(api, 'brokerageName')}</div>
  
              </div>
              <div className="cardText notranslate">
                <div className='containText notranslate'>
                {homeStatus === 'FOR RENT' && (
    <>
    <div className='ghost'>
      <div className='pPrice notranslate'>
        ${formatNumberWithCommas(monthlyPrice)} <span className='currency'>{safeAccess(api, 'currency')}/Month</span>
      </div>
      <div className='pminiPrice notranslate'>
        Est. ${formatNumberWithCommas(yearlyPrice)} annually
      </div>
      </div>
    </>
  )}
                  {homeStatus !== 'FOR RENT' && (
    <>
    <div className='ghost'>
      <div className='pPrice notranslate'>
        ${formatNumberWithCommas(monthlyPrice)} <span className='currency'>{safeAccess(api, 'currency')}</span>
      </div>
      </div>
    </>
  )}
                    <div className='bedd'>{safeAccess(api, 'bedrooms')}&nbsp;Bed(s)</div>
                    <div className='bathh'>{safeAccess(api, 'bathrooms')}&nbsp;Bath(s)</div>
                  <div className='dayss'><FontAwesomeIcon icon={faCircleCheck} style={{color: "#0c6b00",}} /> Active - {safeAccess(api, 'timeOnZillow')}</div>
                  <div className='holding1 notranslate'>
                  <div className='descTextQ notranslate'>Property Status:<br/>{homeStatus}</div>
                  <div className='descTextQ notranslate'>MLS&reg;: {safeAccess(api, 'mlsid')}</div>
                  <div className='descTextQ notranslate'><FontAwesomeIcon icon={faEye} />&nbsp;Views: {safeAccess(api, 'pageViewCount')}</div>
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
            <div className='descTextF notranslate'> County/Region - {safeAccess(api, 'county')}</div>
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
  nearbyHomes
    .filter(home => home.price)  // Filter out homes with price 0/null/undefined
    .map((home, index) => (
      <div
        className="home-card"
        key={index}
        style={{ backgroundImage: `url(${home.miniCardPhotos[0]?.url || noImg})` }}
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
    {Array.isArray(history) && history?.length > 0 ? (
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
    {homeStatus === 'FOR RENT' && (<>
      <div className="adContainer">
     <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-8295243074005821"
     data-ad-slot="3994628164"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                </div>
    <div className="calculatorpd-container">
      <div className='descTextF' >Rent Affordability Calculator</div>
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
      {income && (
        <div className="result">
            <div className='descTextF'>Recommended Gross Monthly Income: ${formatNumberWithCommas((income / 12).toFixed(0))}</div>
            <div className='descTextF'>Recommeded Gross Annual Income: ${formatNumberWithCommas(income)}</div>
        </div>
      )}
    </div>
    <div className="adContainer">
     <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-8295243074005821"
     data-ad-slot="9055383151"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                </div>
     
    </>)}


{homeStatus !== 'FOR RENT' && (<>
  <div className="adContainer">
     <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-8295243074005821"
     data-ad-slot="8863811465"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                </div>
<div className='besty'>
            <div className='descTextF'>Amortization Calculator</div>
            <button className='downPDF' onClick={downloadPDF}>Download Monthly & Annual Amortization Tables &nbsp;<FontAwesomeIcon icon={faFilePdf} size="lg"/></button>
            </div>
        <div className="mortgagepd-container1">
          <label htmlFor="homePrice" className='descTex'>Home Price($):</label>
          <div className="input-group">
            <input
              type="number"
              id="homePrice"
              className='innie'
              min={0}
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
            />
          </div>
          <label htmlFor="downPaymentPercentage" className='descTex'>Down Payment(%):</label>
          <div className="input-group">
            <input
              type="number"
              id="downPaymentPercentage"
              className='innie'
              min={0}
              max={99}
              value={downPaymentPercentage}
              onChange={(e) => setDownPaymentPercentage(e.target.value)}
            />
          </div>
          <label htmlFor="interestRate" className='descTex'>Interest Rate(%):</label>
          <div className="input-group">
            <input
              type="number"
              id="interestRate"
              className='innie'
              min={0}
              max={100}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>
          <label htmlFor="loanTerm" className='descTex'>Loan Term(Years):</label>
          <div className="input-group">
            <input
              type="number"
              id="loanTerm"
              className='innie'
              min={1}
              max={35}
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>
          <label htmlFor="loanAmount" className='descTex'>Loan Amount($):</label>
          <div className="input-group">
            <input
              type="number"
              id="loanAmount"
              className='innie'
              disabled
              value={loanAmount}
            />
          </div>
        </div>

        <div className='descTextFf'>Equated Monthly Instalment (EMI) Details</div>
        <div className="mortgagepd-container">
                   <div className='textChart'>
                   <div className='text-container'>
    <div className='descTex'>Monthly Payment: ${monthlyAmortization.length > 0 ? formatNumberWithCommas(monthlyAmortization[0].mortgagePayment.toFixed(2)) : '-'}</div>
    <div className='descTex'>Home Price: ${formatNumberWithCommas(homePrice)}</div>
    <div className='descTex'>Down Payment: ${formatNumberWithCommas((homePrice * downPaymentPercentage / 100).toFixed(0))}</div>
    <div className='descTex'>Loan Amount: ${formatNumberWithCommas(loanAmount)}</div>
    <div className='descTex'>Total Interest: ${annualAmortization.length > 0 ? formatNumberWithCommas(annualAmortization[annualAmortization.length - 1].totalInterest.toFixed(2)) : '-'}</div>
    <div className='descTex'>Total Repayment: ${annualAmortization.length > 0 ? formatNumberWithCommas((annualAmortization[annualAmortization.length - 1].totalPrincipal + annualAmortization[annualAmortization.length - 1].totalInterest).toFixed(2)) : '-'}</div>
</div>

    <div className='doughnut-chart-container'>
        <canvas id="doughnutChart" width="300" height="250"></canvas>
    </div>
</div>
        </div>
        <div className="adContainer">
     <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-8295243074005821"
     data-ad-slot="8153365028"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                </div>
        <div className='descTextFf'>Annual Amortization Line Graph</div>
        <div className="mortgagepd-container1">
        <div className="chart-container">
            <canvas id="lineChart" width="500" height="350"></canvas>
          </div>
        </div>

        <div className='descTextFf'>Monthly Amortization Schedule</div>
        <div className="schtables-container">
          <table className="excel" id='monthlyTable'>
            <thead>
              <tr>
                <th>Month</th>
                <th>Interest Payment</th>
                <th>Principal Payment</th>
                <th>Monthly Payment</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAmortization.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.month}</td>
                  <td>${formatNumberWithCommas(entry.interest.toFixed(2))}</td>
                  <td>${formatNumberWithCommas(entry.principal.toFixed(2))}</td>
                  <td>${formatNumberWithCommas((entry.principal + entry.interest).toFixed(2))}</td>
                  <td>${formatNumberWithCommas(entry.balance.toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className='descTextFf'>Annual Amortization Schedule</div>
          <div className="schtables-container">

          <table  className="excel" id="annualTable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Interest</th>
                <th>Total Principal</th>
                <th>Annual Payment</th>
                <th>Total Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {annualAmortization.map((entry, index) => (
                <tr key={index}>
                   <td>{entry.year}</td>
          <td>${formatNumberWithCommas(entry.totalInterest.toFixed(2))}</td>
          <td>${formatNumberWithCommas(entry.totalPrincipal.toFixed(2))}</td>
          <td>${formatNumberWithCommas(entry.annualPayment.toFixed(2))}</td>
          <td>${formatNumberWithCommas(entry.totalRemainingBalance.toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
        
        </>)}
        <div className="adContainer">
     <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-8295243074005821"
     data-ad-slot="4419371249"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                </div>
      </main>
      <aside className="rightSidebar">
      <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="2686082201"></ins>
            </aside>
      <Contact />

</>
    );
  };
  
  export default PropertyDetails;
