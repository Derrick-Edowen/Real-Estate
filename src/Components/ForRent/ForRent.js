import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import '../../search.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import noImg from '../../Assets/Images/noimg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight, faRepeat, faCalendarDays, faKey} from '@fortawesome/free-solid-svg-icons';
import FadeLoader from "react-spinners/FadeLoader";


function ForRent() {

  const [apiData, setApiData] = useState(null);
  const [infoData, setInfoData] = useState(null);
const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
const [cardIndex, setCardIndex] = useState(0);
const [searchClicked, setSearchClicked] = useState(false); 
const [isLoading, setIsLoading] = useState(false);
const [selectedCard, setSelectedCard] = useState(null);
const [imageUrls, setImageUrls] = useState([]);
const [lightboxActive, setLightboxActive] = useState(false);
const [selectedCardIndex, setSelectedCardIndex] = useState(null);
const [zoomLevel, setZoomLevel] = useState(11); 
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [searchTrigger, setSearchTrigger] = useState(false); // New state variable
const [noResults, setNoResults] = useState(false); // New state variable
const [page, setPage] = useState(1);
const [showFilter, setShowFilter] = useState(false);
const [isRotated, setIsRotated] = useState(false);
const [nextPage, setNextPage] = useState(1);
const [progress, setProgress] = useState(0);

const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsHost = window.location.host;
const ws = new WebSocket(`ws://testrealestate-0979c394df91.herokuapp.com/:3002`);


const updateMapLocation = async (address) => {
  const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'; // Replace with your Google Maps API key
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    setIsLoading(true); // Set loading state to true during data fetching

    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const { results } = data;
    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      setPosition({ lat, lng });
      setZoomLevel(16); // Set your desired zoom level here
    } else {
      window.alert('Location Not Found: Try Using More Descriptive Words!');
    }

    setIsLoading(false); // Set loading state to false after data is fetched
  } catch (error) {
    console.error('Error fetching data:', error);
    setIsLoading(false); // Ensure loading state is set to false in case of error
  }
};
  const handleCardClick = (index) => {
    setSelectedCard(apiData.estate.props[index]);
    
    (async () => {
      // Update map location when a card is clicked
      const selectedProperty = apiData.estate.props[index];
      await updateMapLocation(selectedProperty.address);
    })();
  };
  
  ws.onopen = function () {
    console.log('WebSocket connected');
  };
  let progressTimer;

  // Receive progress updates from WebSocket
  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const progress = data.progress * 100;
    setProgress(progress); // Update progress state or progress bar
    if (progress === 100) {
      // Reset progress bar to 0% after 3 seconds
      clearTimeout(progressTimer);
      progressTimer = setTimeout(() => {
        setProgress(0);
      }, 3000);
    }
  };
  const handleSearch = async (e) => {
    setIsRotated(!isRotated);
    e.preventDefault();
    setShowFilter(false);
  
    const address = document.getElementById('search').value;
    let state = '';
    const country = document.getElementById('country').value;
    if (country === 'Canada') {
      state = document.getElementById('province').value;
    } else if (country === 'USA') {
      state = document.getElementById('state').value;
    }
    const sort = document.getElementById('sortList').value;
    const propertyType = document.getElementById('choose-type').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const maxBeds = document.getElementById('choose-beds').value;
    const maxBaths = document.getElementById('choose-baths').value;
    const page = 1;
  
    try {
      setIsLoading(true);
      if (parseInt(minPrice) > parseInt(maxPrice)) {
        window.alert('MAXIMUM PRICE MUST BE GREATER THAN MINIMUM PRICE! PLEASE TRY AGAIN!');
        return;
      }
      // WebSocket connection
  
      // WebSocket event listeners
      ws.onopen = function () {
        console.log('WebSocket connected');
      };
  
      // Receive progress updates from WebSocket
      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const progress = data.progress * 100;
        console.log('Progress:', progress);
        setProgress(progress); // Update progress state or progress bar
      };
  
      // Make API call
      const response = await fetch('/api/search-listings-lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          state,
          page,
          country,
          sort,
          propertyType,
          minPrice,
          maxPrice,
          maxBeds,
          maxBaths,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setApiData(data.data);
      setInfoData(data.data.leaseListings);
  
      setIsLoading(false);
      setProgress(100);
    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => {
      setProgress(0);
    }, 2000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
  }, [apiData, infoData]);

const handleNPage = async (e) => {
    setIsRotated(!isRotated);
    e.preventDefault();
    setShowFilter(false);
  
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    const interval = setInterval(() => {
      progressBar.style.width = `${parseInt(progressBar.style.width) + 1}%`;
      if (parseInt(progressBar.style.width) >= 100) {
        clearInterval(interval);
      }
    }, 5);
  
    const address = document.getElementById('search').value;
    let state = '';
    const country = document.getElementById('country').value;
    if (country === 'Canada') {
      state = document.getElementById('province').value;
    } else if (country === 'USA') {
      state = document.getElementById('state').value;
    }
    const sort = document.getElementById('sortList').value;
    const propertyType = document.getElementById('choose-type').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const maxBeds = document.getElementById('choose-beds').value;
    const maxBaths = document.getElementById('choose-baths').value;
  const page = nextPage + 1;
    try {
      setIsLoading(true);
  
      const response = await fetch('/api/search-listings-lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address,
          state,
          page,
          country,
          sort,
          propertyType,
          minPrice,
          maxPrice,
          maxBeds,
          maxBaths
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setApiData(data.data);
      setInfoData(data.data.leaseListings);
      // Handle the response data as needed
  
      setIsLoading(false);
      progressBar.style.width = '100%';
      setTimeout(() => {
        progressBar.style.width = '0%'; // Reset progress bar to 0% after another 2 seconds
      }, 2000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      clearInterval(interval);
    }
  };
  const handlePPage = async (e) => {
    setIsRotated(!isRotated);
    e.preventDefault();
    setShowFilter(false);
  
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    const interval = setInterval(() => {
      progressBar.style.width = `${parseInt(progressBar.style.width) + 1}%`;
      if (parseInt(progressBar.style.width) >= 100) {
        clearInterval(interval);
      }
    }, 5);
  
    const address = document.getElementById('search').value;
    let state = '';
    const country = document.getElementById('country').value;
    if (country === 'Canada') {
      state = document.getElementById('province').value;
    } else if (country === 'USA') {
      state = document.getElementById('state').value;
    }
    const sort = document.getElementById('sortList').value;
    const propertyType = document.getElementById('choose-type').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const maxBeds = document.getElementById('choose-beds').value;
    const maxBaths = document.getElementById('choose-baths').value;
  const page = nextPage - 1;
    try {
      setIsLoading(true);
  
      const response = await fetch('/api/search-listings-lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address,
          state,
          page,
          country,
          sort,
          propertyType,
          minPrice,
          maxPrice,
          maxBeds,
          maxBaths
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setApiData(data.data);
      setInfoData(data.data.leaseListings);
      // Handle the response data as needed
  
      setIsLoading(false);
      progressBar.style.width = '100%';
      setTimeout(() => {
        progressBar.style.width = '0%'; // Reset progress bar to 0% after another 2 seconds
      }, 2000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      clearInterval(interval);
    }
  };
      const handleOpenLightbox = (index) => {
        setSelectedCardIndex(index);
        setLightboxActive(true);
        setCurrentImageIndex(0); // Reset the current image index when opening the lightbox
        (async () => {
      // Update map location when a card is clicked
      const selectedProperty = apiData.estate.props[index];
      await updateMapLocation(selectedProperty.address);
    })();
      };
    
      const handleCloseLightbox = () => {
        setSelectedCardIndex(null);
        setLightboxActive(false);
      };
      const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % infoData[selectedCardIndex].images.images.length;
        setCurrentImageIndex(nextIndex);
      };
      
      const handlePrevImage = () => {
        const prevIndex = (currentImageIndex - 1 + infoData[selectedCardIndex].images.images.length) % infoData[selectedCardIndex].images.images.length;
        setCurrentImageIndex(prevIndex);
      };
      function formatNumberWithCommas(number) {
        if (typeof number === 'undefined' || number === null) {
          return;
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      
    const toggleFilter = () => {
      setShowFilter(!showFilter);
      setIsRotated(!isRotated);

  };
  function safeAccess(obj, path) {
    if (!path || typeof path !== 'string') {
      return "Information Unavailable";
    }
    return path.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : "Information Unavailable"), obj);
  }

  const handlePrevPage = (e) => {
    setNextPage(nextPage - 1);
    handlePPage(e); // Trigger handleSearch with the updated page number
  };

  const handleNextPage = (e) => {
    setNextPage(nextPage + 1);
    handleNPage(e); // Trigger handleSearch with the updated page number
  };
let state = '';
return (
  <div className='lists notranslate'>
    <div className='overlay notranslate'>
      <aside className='screen-1'>
        <div className='starter'>Find Listings - For Lease</div>
        <button className="toggle" onClick={toggleFilter}> Lease Property Filter  
          <div className={`changin ${isRotated && 'rotate'}`}>&#9660;</div>
        </button>
        <form className={`supyo ${showFilter && 'visible'}`} onSubmit={handleSearch}>
          <input className='notranslate' id='search' type='text' placeholder='Enter a city!' required />
          
          <select
            className="notranslate"
            id="country"
            name="country"
            placeholder="Select a Country"
            required
            onChange={(e) => {
              const selectElement = e.target;
              const selectedOption = selectElement.options[selectElement.selectedIndex];
              
              // Remove the green check mark from all options
              selectElement.querySelectorAll('option').forEach(option => {
                option.style.color = 'black'; // Reset color to black for all options
              });
              // Change color of the selected option
              selectedOption.style.color = 'black'; // Change color to dark grey for the selected option
            
            
              // Update state variable based on selected country
              if (selectedOption.value === 'Canada') {
                state = document.getElementById('province').value; // Update state with province value
                document.getElementById('province').style.display = 'block'; // Show the province select
                document.getElementById('state').style.display = 'none'; // Hide the state select
              } else if (selectedOption.value === 'USA') {
                state = document.getElementById('state').value; // Update state with state value
                document.getElementById('province').style.display = 'none'; // Hide the province select
                document.getElementById('state').style.display = 'block'; // Show the state select
              } else {
                state = ''; // Reset state if neither Canada nor USA is selected
                document.getElementById('province').style.display = 'none'; // Hide both selects
                document.getElementById('state').style.display = 'none';
              }
            }}
          >
            <option value="Canada">Canada</option>
            <option value="USA">USA</option>
          </select>
          <select
            className="notranslate"
            id="province"
            placeholder="Select a Province"
            style={{ display: 'block' }} // Initially hide the province select
            required
            onChange={(e) => {
              state = e.target.value; // Update state with selected province value
            }}
          >
<option value="Alberta">Alberta</option>
  <option value="British Columbia">British Columbia</option>
  <option value="Manitoba">Manitoba</option>
  <option value="New Brunswick">New Brunswick</option>
  <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
  <option value="Nova Scotia">Nova Scotia</option>
  <option value="Ontario">Ontario</option>
  <option value="Prince Edward Island">Prince Edward Island</option>
  <option value="Quebec">Quebec</option>
  <option value="Saskatchewan">Saskatchewan</option>
  <option value="Northwest Territories">Northwest Territories</option>
  <option value="Nunavut">Nunavut</option>
  <option value="Yukon">Yukon</option></select>
  <select
            className="notranslate"
            id="state"
            placeholder="Select a State"
            style={{ display: 'none' }} // Initially hide the state select
            required
            onChange={(e) => {
              state = e.target.value; // Update state with selected state value
            }}
          >
<option value="AL">Alabama</option>
<option value="AK">Alaska</option>
<option value="AZ">Arizona</option>
<option value="AR">Arkansas</option>
<option value="CA">California</option>
<option value="CO">Colorado</option>
<option value="CT">Connecticut</option>
<option value="DE">Delaware</option>
<option value="FL">Florida</option>
<option value="GA">Georgia</option>
<option value="HI">Hawaii</option>
<option value="ID">Idaho</option>
<option value="IL">Illinois</option>
<option value="IN">Indiana</option>
<option value="IA">Iowa</option>
<option value="KS">Kansas</option>
<option value="KY">Kentucky</option>
<option value="LA">Louisiana</option>
<option value="ME">Maine</option>
<option value="MD">Maryland</option>
<option value="MA">Massachusetts</option>
<option value="MI">Michigan</option>
<option value="MN">Minnesota</option>
<option value="MS">Mississippi</option>
<option value="MO">Missouri</option>
<option value="MT">Montana</option>
<option value="NE">Nebraska</option>
<option value="NV">Nevada</option>
<option value="NH">New Hampshire</option>
<option value="NJ">New Jersey</option>
<option value="NM">New Mexico</option>
<option value="NY">New York</option>
<option value="NC">North Carolina</option>
<option value="ND">North Dakota</option>
<option value="OH">Ohio</option>
<option value="OK">Oklahoma</option>
<option value="OR">Oregon</option>
<option value="PA">Pennsylvania</option>
<option value="RI">Rhode Island</option>
<option value="SC">South Carolina</option>
<option value="SD">South Dakota</option>
<option value="TN">Tennessee</option>
<option value="TX">Texas</option>
<option value="UT">Utah</option>
<option value="VT">Vermont</option>
<option value="VA">Virginia</option>
<option value="WA">Washington</option>
<option value="WV">West Virginia</option>
<option value="WI">Wisconsin</option>
<option value="WY">Wyoming</option></select>
       <select
  className="notranslate"
  id="sortList"
  name="sort"
  placeholder="Sort Listings"
  required
  onChange={(e) => {
    const selectElement = e.target;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    // Reset color of all options
    selectElement.querySelectorAll('option').forEach(option => {
      option.style.color = 'black'; // Reset color to black for all options
    });
    // Change color of the selected option
    selectedOption.style.color = 'black'; // Change color to dark grey for the selected option
  }}
>
  <option value="" disabled selected>Sort Listings</option>
  <option value="Newest">Newest</option>
  <option value="Payment_High_Low">Ascending - Price</option>
  <option value="Payment_Low_High">Descending - Price</option>
  <option value="Lot_Size">Lot Size</option>
  <option value="Square_Feet">Square Footage</option>
</select>

                    <select className='notranslate' 
                    id="choose-type" 
                    name="propertyType" 
                    placeholder='Property Type' 
                    required
                    onChange={(e) => {
                      const selectElement = e.target;
                      const selectedOption = selectElement.options[selectElement.selectedIndex];
                      // Remove the green check mark from all options
                      selectElement.querySelectorAll('option').forEach(option => {
                        option.style.color = 'black'; // Reset color to black for all options
    });
    // Change color of the selected option
    selectedOption.style.color = 'black'; // Change color to dark grey for the selected option
  }}
                    >
                      <option value="" disabled selected>Property Type</option>
                      <option value="Houses">Houses</option>
                      <option value="Townhomes">Townhomes</option>
                      <option value="Apartments_Condos_Co-ops">Condominiums</option>
                    </select>
                    <select className='notranslate' 
                    id="choose-beds" 
                    name="beds" 
                    placeholder='Beds' 
                    required
                    onChange={(e) => {
                      const selectElement = e.target;
                      const selectedOption = selectElement.options[selectElement.selectedIndex];
                      // Remove the green check mark from all options
                      selectElement.querySelectorAll('option').forEach(option => {
                        option.style.color = 'black'; // Reset color to black for all options
                      });
                      // Change color of the selected option
                      selectedOption.style.color = 'black'; // Change color to dark grey for the selected option
                    }}
                    >
                      <option value="" disabled selected>Beds</option>
                      <option value="0">Any</option>
                      <option value="1">1 Bed</option>
                      <option value="2">2 Beds</option>
                      <option value="3">3 Beds</option>
                      <option value="4">4 Beds</option>
                      <option value="5">5 Beds</option>
                    </select>
                    <select className='notranslate' 
                    id="choose-baths" 
                    name="baths" 
                    placeholder='Baths' 
                    required
                    onChange={(e) => {
                      const selectElement = e.target;
                      const selectedOption = selectElement.options[selectElement.selectedIndex];
                      // Remove the green check mark from all options
                      selectElement.querySelectorAll('option').forEach(option => {
                        option.style.color = 'black'; // Reset color to black for all options
                      });
                      // Change color of the selected option
                      selectedOption.style.color = 'black'; // Change color to dark grey for the selected option
                    }}
                    >
                      <option value="" disabled selected>Baths</option>
                      <option value="0">Any</option>
                      <option value="1">1 Bath</option>
                      <option value="2">2 Baths</option>
                      <option value="3">3 Baths</option>
                      <option value="4">4 Baths</option>
                      <option value="5">5 Baths</option>
                    </select>
                  <input className='notranslate' type='number' id="min-price" placeholder='Minimum Price' required />
                  <input className='notranslate' type='number' id="max-price" placeholder='Maximum Price' required />
                  <button className='searchBtn-1'>Search</button>
              </form>
    </aside> 
        <main className='fullStage notranslate'>
        {isLoading ? (
          <div className="loadingMessage1 translate">
            <FadeLoader color="#f5fcff" margin={10} />
          </div>
        ) : (
          <>
                    {apiData && apiData.estate && apiData.estate.props && apiData.estate.props.length > 0 && (
          <div className='capture'>
          {apiData.estate.totalPages > 1 && (
            <button 
  className={`prevButton ${page === apiData.estate.currentPage ? 'disabled' : ''}`}
  onClick={handlePrevPage}
    disabled={apiData.estate.currentPage === 1}
>
  Previous Page
</button>)}
<div className='alone'>{apiData.estate.totalResultCount} Results - Page {apiData.estate.currentPage} of {apiData.estate.totalPages} </div>
          {apiData.estate.totalPages > 1 && (
            <button 
            className={`nextButton ${apiData.estate.currentPage === apiData.estate.totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={apiData.estate.currentPage === apiData.estate.totalPages}
            >Next Page</button>
      )}
      </div>
          )}

{apiData && apiData.estate && apiData.estate.props && apiData.estate.props.length > 0 ? (
  <div className="cardContainer notranslate">
    {apiData.estate.props.map((property, index) => (
      property && ( // Check if property is not null/undefined
        <div
          className="cardi1 notranslate"
          key={index}
          onClick={() => handleOpenLightbox(index)}
        >
          <div className='indigo'>
            <img className='mommy' src={property.imgSrc ||infoData[index]?.images.images[0] || noImg} alt={'No Image Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%'}}/>     
            <div className='cDress1 notranslate'>${formatNumberWithCommas(property.price) || "Information Unavailable"}</div>
          </div>                
          <div className="cardText1 notranslate">
            <div className='holding2 notranslate'>
              <div className='cardBed notranslate'>{property.bedrooms || "Undisclosed # of"} Beds&nbsp;|</div>
              <div className='cardBaths notranslate'>{property.bathrooms || "Undisclosed # of"} Baths&nbsp;|</div>
              <div className='cardMls notranslate'>MLS&reg;:{infoData[index]?.mlsid || "Undisclosed"}</div>
            </div>
            <div className='cPrice1 notranslate'>{property.address || "Information Unavailable"}</div>
          </div>
        </div>
      ))
    )}
  </div>
) : (
  searchClicked && apiData === null && apiData.estate === undefined (
    <div className="noResultsMessage">
      Sorry, No Listings Found!
    </div>
  )
)}

{lightboxActive && selectedCardIndex !== null && (
  <div className="lightbox notranslate" onClick={handleCloseLightbox}>
    <div className="lightbox-content notranslate" onClick={(e) => e.stopPropagation()}>
      {/* Lightbox content goes here */}
      {infoData[selectedCardIndex] && infoData[selectedCardIndex].images && (
        <>
        <div className='aver'>
          <div className='pAddress-1 notranslate'>{safeAccess(infoData[selectedCardIndex], 'address.streetAddress') +" "+ safeAccess(infoData[selectedCardIndex], 'address.zipcode')+" - "+ 
          safeAccess(infoData[selectedCardIndex], 'address.city') +" , "+ safeAccess(infoData[selectedCardIndex], 'address.state')
           }</div>
          <button className="lightbox-close notranslate" onClick={handleCloseLightbox}>
            Close
          </button>
          </div>
          <div className='side-by-side-container notranslate'>
            <div className='fixer notranslate'>
              <button className="lightbox-left notranslate" onClick={handlePrevImage}>
              &#8678;
              </button>
              <img src={infoData[selectedCardIndex].images.images[currentImageIndex] || noImg} alt="Sorry, Image Unavailable!" />
              <button className="lightbox-right notranslate" onClick={handleNextImage}>
              &#8680;
              </button> 
            </div> 
            <div className="cardText notranslate">
              <div className='containText notranslate'>
                <div className='pAddress notranslate'>{safeAccess(infoData[selectedCardIndex], 'address.streetAddress') +" "+ safeAccess(infoData[selectedCardIndex], 'address.zipcode')}</div>
                <div className='pPrice notranslate'>${safeAccess(infoData[selectedCardIndex], 'price')}/Month</div>
              <div className='heallin'>
                <div className='bedd'>&nbsp;{safeAccess(infoData[selectedCardIndex], 'bedrooms')}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='bathh'>&nbsp;{safeAccess(infoData[selectedCardIndex], 'bathrooms')}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='dayss'>&nbsp; Active ({safeAccess(infoData[selectedCardIndex], 'timeOnZillow')})</div>            
                </div>
                <div className='descText notranslate'>{safeAccess(infoData[selectedCardIndex], 'description')}</div>
                <div className='holding1 notranslate'>
                <div className='cardPark notranslate'>&nbsp;Allocated Parking Spaces - {safeAccess(infoData[selectedCardIndex], 'resoFacts.parkingCapacity')}</div>
                  <div className='cardFire notranslate'>&nbsp;Heating Status - {safeAccess(infoData[selectedCardIndex], 'resoFacts.heating.0')}/{safeAccess(infoData[selectedCardIndex], 'resoFacts.heating.1')} &nbsp;</div>
                  <div className='cardWind notranslate'>&nbsp;Cooling Status - {safeAccess(infoData[selectedCardIndex], 'resoFacts.cooling.0')}&nbsp;</div>
                  <div className='cardMl notranslate'>&nbsp;MLS&reg;: {safeAccess(infoData[selectedCardIndex], 'mlsid')}&nbsp;</div>
                  <div className='cardBroke notranslate'>&nbsp;Listing Provided by: {safeAccess(infoData[selectedCardIndex], 'brokerageName')}&nbsp;</div>  
                </div> 
              </div>
            </div>
          </div>
          <div className='map notranslate'>
            <APIProvider apiKey='AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'>
              <Map center={position} zoom={zoomLevel} mapTypeId ='hybrid' >
                <Marker position={position}/>
              </Map>
            </APIProvider>
          </div>
                      
                               
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
</div>

  </div>
  
</div>

);
}

 
export default ForRent;
