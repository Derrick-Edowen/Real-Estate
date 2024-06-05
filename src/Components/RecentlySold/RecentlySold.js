import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import 'bootstrap/dist/css/bootstrap.min.css';
import noImg from '../../Assets/Images/noimg.jpg'
import FadeLoader from "react-spinners/FadeLoader";
import '../../search.css'
import Footer from '../Footer/Footer';
import { v4 as uuidv4 } from 'uuid'; // Using 'uuid' package for unique ID generation

function RecentlySold() {
  const [initialData, setInitialData] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [infoData, setInfoData] = useState([]);
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
  const [selectedCountry, setSelectedCountry] = useState('Canada'); // Initialize selected country state to 'Canada'
  const [progress, setProgress] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState('');
const [selectedState, setSelectedState] = useState('');
const [selectedSort, setSelectedSort] = useState('');
const [selectedPropertyType, setSelectedPropertyType] = useState('');
const [selectedBeds, setSelectedBeds] = useState('');
const [selectedBaths, setSelectedBaths] = useState('');
const [selectedCountries, setSelectedCountries] = useState('');
const initialDataRef = useRef(null);
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const [ws, setWs] = useState(null);

  
  

const updateMapLocation = async (address) => {
  try {
    setIsLoading(true); // Set loading state to true during data fetching
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

    setIsLoading(false); // Set loading state to false after data is fetched
  } catch (error) {
    console.error('Error fetching data:', error);
    setIsLoading(false); // Ensure loading state is set to false in case of error
  }
};

const handleSearch = async (e) => {
  e.preventDefault();
  setIsRotated(!isRotated);
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  const address = document.getElementById('search').value;
  let state = '';
  const country = document.getElementById('country').value;
  if (country === 'Canada') {
    state = document.getElementById('province').value;
  } else if (country === 'USA') {
    state = document.getElementById('state').value;
  }
  const sort = document.getElementById('sortList').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const maxBeds = document.getElementById('choose-beds').value;
  const maxBaths = document.getElementById('choose-baths').value;
  const page = 1;
  const type = 3;

  try {
    setIsLoading(true);
    if (parseInt(minPrice) > parseInt(maxPrice)) {
      window.alert('MAXIMUM PRICE MUST BE GREATER THAN MINIMUM PRICE! PLEASE TRY AGAIN!');
      return;
    }

    // WebSocket connection
    const id = uuidv4(); // Generate a unique ID for this client
    const wsPort = window.location.port; // Use the port of your backend
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = window.location.hostname;
    const ws = new WebSocket(`${wsProtocol}://${wsHost}:${wsPort}/api/socket`);
    
    // WebSocket event listeners
    ws.onopen = function () {
      ws.send(JSON.stringify({ id })); // Send the unique identifier to the server upon connection

      // Make API call with the unique ID only after WebSocket is open
      fetch('/api/search-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id, // Include the unique ID in the request body
          address,
          state,
          page,
          type,
          country,
          sort,
          minPrice,
          maxPrice,
          maxBeds,
          maxBaths,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }).catch(error => {
        console.error('Error in handleSearch:', error);
        setIsLoading(false);
      });
    };

    // Receive progress updates and property data from WebSocket
    setIsLoading(false);
    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.noResults) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
        if (data.zpids) {
          initialDataRef.current = data.zpids;
          setInitialData(data.zpids);
        }

        if (data.property) {
          setApiData((prevData) => [...prevData, data.property]);
          setInfoData((prevData) => [...prevData, data.images]);
        } 
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    ws.onclose = function () {
    };

  } catch (error) {
    console.error('Error in handleSearch:', error);
    setIsLoading(false);
  }
};

const handleNPage = async (e) => {
  setIsRotated(!isRotated);
  e.preventDefault();
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  const address = document.getElementById('search').value;
  let state = '';
  const country = document.getElementById('country').value;
  if (country === 'Canada') {
    state = document.getElementById('province').value;
  } else if (country === 'USA') {
    state = document.getElementById('state').value;
  }
  const sort = document.getElementById('sortList').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const maxBeds = document.getElementById('choose-beds').value;
  const maxBaths = document.getElementById('choose-baths').value;
  const page = nextPage + 1;
  const type = 3;


  try {
    setIsLoading(true);
    if (parseInt(minPrice) > parseInt(maxPrice)) {
      window.alert('MAXIMUM PRICE MUST BE GREATER THAN MINIMUM PRICE! PLEASE TRY AGAIN!');
      return;
    }

    // WebSocket connection
    const wsPort = window.location.port; // Use the port of your backend
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = window.location.hostname;
    const ws = new WebSocket(`${wsProtocol}://${wsHost}:${wsPort}/api/socket`);

    // WebSocket event listeners
    ws.onopen = function () {
    };

    // Receive progress updates and property data from WebSocket
    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.noResults) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
        if (data.zpids) {
          initialDataRef.current = data.zpids;
          setInitialData(data.zpids);
        }

        if (data.property) {
          setApiData((prevData) => [...prevData, data.property]);
          setInfoData((prevData) => [...prevData, data.images]);
        } 
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    ws.onclose = function () {
    };

    // Make API call
    const response = await fetch('/api/search-listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        state,
        page,
        type,
        country,
        sort,
        minPrice,
        maxPrice,
        maxBeds,
        maxBaths,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    setIsLoading(false);

  } catch (error) {
    console.error('Error in handleSearch:', error);
    setIsLoading(false);
  }
};

const handlePPage = async (e) => {
  setIsRotated(!isRotated);
  e.preventDefault();
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  const address = document.getElementById('search').value;
  let state = '';
  const country = document.getElementById('country').value;
  if (country === 'Canada') {
    state = document.getElementById('province').value;
  } else if (country === 'USA') {
    state = document.getElementById('state').value;
  }
  const sort = document.getElementById('sortList').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const maxBeds = document.getElementById('choose-beds').value;
  const maxBaths = document.getElementById('choose-baths').value;
  const page = nextPage - 1;
  const type = 3;


  try {
    setIsLoading(true);
    if (parseInt(minPrice) > parseInt(maxPrice)) {
      window.alert('MAXIMUM PRICE MUST BE GREATER THAN MINIMUM PRICE! PLEASE TRY AGAIN!');
      return;
    }

    // WebSocket connection
    const wsPort = window.location.port; // Use the port of your backend
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = window.location.hostname;
    const ws = new WebSocket(`${wsProtocol}://${wsHost}:${wsPort}/api/socket`);

    // WebSocket event listeners
    ws.onopen = function () {
    };

    // Receive progress updates and property data from WebSocket
    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.noResults) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
        if (data.zpids) {
          initialDataRef.current = data.zpids;
          setInitialData(data.zpids);
        }

        if (data.property) {
          setApiData((prevData) => [...prevData, data.property]);
          setInfoData((prevData) => [...prevData, data.images]);
        } 
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    ws.onclose = function () {
    };

    // Make API call
    const response = await fetch('/api/search-listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        state,
        page,
        type,
        country,
        sort,
        minPrice,
        maxPrice,
        maxBeds,
        maxBaths,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    setIsLoading(false);

  } catch (error) {
    console.error('Error in handleSearch:', error);
    setIsLoading(false);
  }
};
const handleOpenLightbox = (index) => {
  setSelectedCardIndex(index);
  setLightboxActive(true);
  setCurrentImageIndex(0); // Reset the current image index when opening the lightbox
  (async () => {
    // Update map location when a card is clicked
    const selectedProperty = apiData[index];
    const fullAddress = `${selectedProperty.address.streetAddress}, ${selectedProperty.address.city}, ${selectedProperty.address.state}`;
    await updateMapLocation(fullAddress);
  })();
};
      
        const handleCloseLightbox = () => {
          setSelectedCardIndex(null);
          setLightboxActive(false);
        };
        const handleNextImage = () => {
          const nextIndex = (currentImageIndex + 1) % infoData[selectedCardIndex].images.length;
          setCurrentImageIndex(nextIndex);
        };
        
        const handlePrevImage = () => {
          const prevIndex = (currentImageIndex - 1 + infoData[selectedCardIndex].images.length) % infoData[selectedCardIndex].images.length;
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
        return "Undisclosed";
      }
      return path.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : "Undisclosed"), obj);
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
          <div className='starter'>Find Listings - Recently Sold</div>
          <button className="toggle" onClick={toggleFilter}> Recently Sold Property Filter  
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
              style={{ backgroundColor: selectedCountries ? '#d3d3d3' : 'white' }}

            onChange={(e) => {
              setSelectedCountries(e.target.value); // Update selected sort
                const selectElement = e.target;
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                setSelectedCountry(selectedOption.value); // Update selected country state

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
              value={selectedCountry} // Bind the selected country state to the value of the select element

            >
              <option value="Canada">Canada</option>
              <option value="USA">USA</option>
            </select>
            <select
              className="notranslate"
              id="province"
              placeholder="Select a Province"
              style={{ display: 'block', backgroundColor: selectedProvince ? '#d3d3d3' : 'white' }}
  onChange={(e) => {
                state = e.target.value; // Update state with selected province value
                setSelectedProvince(e.target.value); // Update selected province

              }}
            >
                <option disabled selected value="">Select a Province</option>
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
              style={{ display: 'none', backgroundColor: selectedState ? '#d3d3d3' : 'white' }}
            onChange={(e) => {
                state = e.target.value; // Update state with selected state value
                setSelectedState(e.target.value); // Update selected province
              }}
            >
                <option disabled selected value="">Select a State</option>
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
    style={{ backgroundColor: selectedSort ? '#d3d3d3' : 'white' }}
  onChange={(e) => {
    setSelectedSort(e.target.value); // Update selected sort
  }}
  >
    <option value="" disabled selected>Sort Listings</option>
    <option value="Newest">Newest</option>
    <option value="Payment_High_Low">Ascending - Price</option>
    <option value="Payment_Low_High">Descending - Price</option>
    <option value="Lot_Size">Lot Size</option>
    <option value="Square_Feet">Square Footage</option>
    <option value="Bedrooms">Bedrooms</option>
  <option value="Bathrooms">Bathrooms</option>
  </select>
                      <select className='notranslate' 
                      id="choose-beds" 
                      name="beds" 
                      placeholder='Beds' 
                      required
                      style={{ backgroundColor: selectedBeds ? '#d3d3d3' : 'white' }}
                      onChange={(e) => {
                        setSelectedBeds(e.target.value); // Update selected beds
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
                      style={{ backgroundColor: selectedBaths ? '#d3d3d3' : 'white' }}
                    onChange={(e) => {
                      setSelectedBaths(e.target.value); // Update selected baths
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
                {initialData && (
        <div className='capture'>
          {initialData.totalPages > 1 && (
            <button
              className={`prevButton ${initialData.currentPage === 1 ? 'disabled' : ''}`}
              onClick={handlePrevPage}
              disabled={initialData.currentPage === 1}
            >
              Previous Page
            </button>
          )}
          <div className='alone'>{initialData.totalResultCount} Results - Page {initialData.currentPage} of {initialData.totalPages}</div>
          {initialData.totalPages > 1 && (
            <button
              className={`nextButton ${initialData.currentPage === initialData.totalPages ? 'disabled' : ''}`}
              onClick={handleNextPage}
              disabled={initialData.currentPage === initialData.totalPages}
            >
              Next Page
            </button>
          )}
        </div>
      )}
{apiData && apiData.length > 0 ? (
        <div className="cardContainer notranslate">
          {apiData.map((property, index) => (
            property && ( // Check if property is not null/undefined
              <div
                className="cardi1 notranslate"
                key={index}
                onClick={() => handleOpenLightbox(index)}
              >
                <div className='indigo'>
                  <img className='mommy' src={property.imgSrc || infoData[index]?.imgSrc || noImg} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
                  <div className='cDress1 notranslate'> ${formatNumberWithCommas(safeAccess(property, 'price'))}
                  </div>
                </div>
                <div className="cardText1 notranslate">
                  <div className='holding2 notranslate'>
                    <div className='cardBed notranslate'>{safeAccess(property, 'bedrooms')} Beds&nbsp;|</div>
                    <div className='cardBaths notranslate'>{safeAccess(property, 'bathrooms')} Baths&nbsp;|</div>
                    <div className='cardMls notranslate'>MLS&reg;:{safeAccess(property, 'mlsid')}</div>
                  </div>
                  <div className='cPrice1 notranslate'>{safeAccess(property, 'address.streetAddress') +" "+ safeAccess(property, 'address.zipcode')+" - "+ 
                safeAccess(property, 'address.city') +" , "+ safeAccess(property, 'address.state')
                }</div>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        noResults && (
          <div className="noResultsMessage">
            Sorry, No Listings Found!
          </div>
        )
      )}

{lightboxActive && selectedCardIndex !== null && (
  <div className="lightbox notranslate" onClick={handleCloseLightbox}>
    <div className="lightbox-content notranslate" onClick={(e) => e.stopPropagation()}>
      {/* Lightbox content goes here */}
      {apiData[selectedCardIndex] && (
        <>
        <div className='aver'>
          <div className='pAddress-1 notranslate'>{safeAccess(apiData[selectedCardIndex], 'address.streetAddress') +" "+ safeAccess(apiData[selectedCardIndex], 'address.zipcode')+" - "+ 
          safeAccess(apiData[selectedCardIndex], 'address.city') +" , "+ safeAccess(apiData[selectedCardIndex], 'address.state')
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
              <img src={infoData[selectedCardIndex].images[currentImageIndex] || noImg} alt="Sorry, Image Unavailable!" />
              <button className="lightbox-right notranslate" onClick={handleNextImage}>
              &#8680;
              </button> 
            </div> 
            <div className="cardText notranslate">
              <div className='containText notranslate'>
                <div className='pAddress notranslate'>{safeAccess(apiData[selectedCardIndex], 'address.streetAddress') +" "+ safeAccess(apiData[selectedCardIndex], 'address.zipcode')}</div>
                <div className='pPrice notranslate'>
  ${formatNumberWithCommas(safeAccess(apiData[selectedCardIndex], 'price') || "Undisclosed")}{' '}
  <span style={{ fontSize: 'smaller' }}>{selectedCountry === 'Canada' ? 'CAD' : 'USD'}</span>
</div>
              <div className='heallin'>
                <div className='bedd'>&nbsp;{safeAccess(apiData[selectedCardIndex], 'bedrooms')}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='bathh'>&nbsp;{safeAccess(apiData[selectedCardIndex], 'bathrooms')}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='dayss'>&nbsp; Active ({safeAccess(apiData[selectedCardIndex], 'timeOnZillow')})</div>  
                <div className='dayss'>Square Footage(sqft) - {formatNumberWithCommas(safeAccess(apiData[selectedCardIndex], 'livingAreaValue'))}</div>         
          
                </div>
                <div className='descText notranslate'>{safeAccess(apiData[selectedCardIndex], 'description')}</div>
                <div className='holding1 notranslate'>
                  <div className='cardFire notranslate'>&nbsp;Heating Status - {safeAccess(apiData[selectedCardIndex], 'resoFacts.heating.0')}&nbsp;</div>
                  <div className='cardWind notranslate'>&nbsp;Cooling Status - {safeAccess(apiData[selectedCardIndex], 'resoFacts.cooling.0')}&nbsp;</div>
                  <div className='cardMl notranslate'>&nbsp;MLS&reg;: {safeAccess(apiData[selectedCardIndex], 'mlsid')}&nbsp;</div>
                  <div className='cardBroke notranslate'>&nbsp;Listing Provided by: {safeAccess(apiData[selectedCardIndex], 'brokerageName')}&nbsp;</div>  
                </div> 
              </div>
            </div>
          </div>
          <div className='map notranslate'>
            <APIProvider apiKey={apiKey}>
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
  
    </div>
    
  </div>
  
  );
  }
 
export default RecentlySold;







