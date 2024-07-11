import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import '../../search.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import noImg from '../../Assets/Images/noimg.jpg'
import FadeLoader from "react-spinners/FadeLoader";
import Footer from '../Footer/Footer';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Using 'uuid' package for unique ID generation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function ForRent() {

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
const [selectedProvince, setSelectedProvince] = useState('');
const [selectedState, setSelectedState] = useState('');
const [selectedSort, setSelectedSort] = useState('');
const [selectedPropertyType, setSelectedPropertyType] = useState('');
const [selectedBeds, setSelectedBeds] = useState('');
const [selectedBaths, setSelectedBaths] = useState('');
const [selectedCountries, setSelectedCountries] = useState('');
const initialDataRef = useRef(null);
const [selectedTypes, setSelectedTypes] = useState([]);
const [selectedPType, setSelectedPType] = useState(1);
const [selectedStatus, setSelectedStatus] = useState('');
const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [searchParams, setSearchParams] = useState({
  address: '',
  state: '',
  page: 1,
  type: 0,
  tier: '',
  country: '',
  sort: '',
  minPrice: '',
  maxPrice: '',
  maxBeds: '',
  maxBaths: ''
});


const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const [ws, setWs] = useState(null);



const handleSearch = async (e) => {
  e.preventDefault();
  setIsRotated(!isRotated);
  setIsDropdownOpen(false);
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  // Clear saved search parameters
  setSearchParams({
    address: '',
    state: '',
    page: 1,
    type: 0,
    tier: '',
    country: '',
    sort: '',
    minPrice: '',
    maxPrice: '',
    maxBeds: '',
    maxBaths: ''
  });

  const address = document.getElementById('search').value;
  let state = '';
  const country = document.getElementById('country').value;
  if (country === 'Canada') {
    state = document.getElementById('province').value;
  } else if (country === 'USA') {
    state = document.getElementById('state').value;
  }
  if (selectedTypes.length === 0) {
    window.alert('Please select at least one property type.');
    return;
  }
  const selectedTypesString = selectedTypes.join(', ');
  const sort = document.getElementById('sortList').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const maxBeds = document.getElementById('choose-beds').value;
  const maxBaths = document.getElementById('choose-baths').value;
  const page = 1;
  const type = parseInt(document.getElementById('choose-search').value, 10); // Parse as integer
  const tier = selectedTypesString;
  
  // Save search parameters
  setSearchParams({
    address,
    state,
    page,
    type,
    tier,
    country,
    sort,
    minPrice,
    maxPrice,
    maxBeds,
    maxBaths
  });

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
          tier,
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
        if (data) {
          initialDataRef.current = data;
          setInitialData(data);
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
  e.preventDefault();
  setIsRotated(!isRotated);
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  const nextPage = searchParams.page + 1;

  try {
    setIsLoading(true);

    if (parseInt(searchParams.minPrice) > parseInt(searchParams.maxPrice)) {
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
          address: searchParams.address,
          state: searchParams.state,
          page: nextPage,
          type: searchParams.type,
          tier: searchParams.tier,
          country: searchParams.country,
          sort: searchParams.sort,
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          maxBeds: searchParams.maxBeds,
          maxBaths: searchParams.maxBaths,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }).catch(error => {
        console.error('Error in handleNPage:', error);
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
        if (data) {
          initialDataRef.current = data;
          setInitialData(data);
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
    console.error('Error in handleNPage:', error);
    setIsLoading(false);
  }

  // Update the search parameters with the new page number
  setSearchParams(prevParams => ({
    ...prevParams,
    page: nextPage
  }));
};

const handlePPage = async (e) => {
  e.preventDefault();
  setIsRotated(!isRotated);
  setShowFilter(false);
  setInitialData(null);
  setApiData([]);
  setInfoData([]);
  initialDataRef.current = null;

  const prevPage = searchParams.page - 1;

  try {
    setIsLoading(true);

    if (parseInt(searchParams.minPrice) > parseInt(searchParams.maxPrice)) {
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
          address: searchParams.address,
          state: searchParams.state,
          page: prevPage,
          type: searchParams.type,
          tier: searchParams.tier,
          country: searchParams.country,
          sort: searchParams.sort,
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          maxBeds: searchParams.maxBeds,
          maxBaths: searchParams.maxBaths,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }).catch(error => {
        console.error('Error in handlePPage:', error);
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
        if (data) {
          initialDataRef.current = data;
          setInitialData(data);
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
    console.error('Error in handlePPage:', error);
    setIsLoading(false);
  }

  // Update the search parameters with the new page number
  setSearchParams(prevParams => ({
    ...prevParams,
    page: prevPage
  }));
};
const handleOpenLightbox = async (index) => {
  const property = initialDataRef.current.zpids.props[index];

  try {
    const response = await fetch('/api/fetch-property-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zpid: property.zpid }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const propertyData = {
      property: data.property,
      images: data.images,
      info: data.images, // Ensure data.info exists in your API response
      api: data.api // Ensure data.api exists in your API response
    };

    sessionStorage.setItem('propertyData', JSON.stringify(propertyData));

    const address = `${safeAccess(data.property, 'address.streetAddress')} ${safeAccess(data.property, 'address.zipcode')} ${safeAccess(data.property, 'address.city')} ${safeAccess(data.property, 'address.state')}`;
    const urlAddress = encodeURIComponent(address.replace(/\s+/g, '-').toLowerCase());

    const url = `/Property-Details/${urlAddress}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error fetching property details:', error);
  }
};





      const handleCloseLightbox = () => {
        setSelectedCardIndex(null);
        setLightboxActive(false);
      };
      const handlePrevImage = () => {
        const prevIndex = (currentImageIndex - 1 + infoData[selectedCardIndex].images.length) % infoData[selectedCardIndex].images.length;
        setCurrentImageIndex(prevIndex);
      };
    
      const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % infoData[selectedCardIndex].images.length;
        setCurrentImageIndex(nextIndex);
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
let status = '';
const handleCheckboxChange = (type) => {
  if (selectedTypes.includes(type)) {
    setSelectedTypes(selectedTypes.filter(t => t !== type));
  } else {
    setSelectedTypes([...selectedTypes, type]);
  }
};

const renderPlaceholderOrSelected = () => {
  if (selectedTypes.length === 0) {
    return `Select a Property Type     \u2304`; // Include the downward chevron
  }
  return selectedTypes.join(', ');
};
const toggleDropdown = () => {
  setIsDropdownOpen(!isDropdownOpen);
};
const handlePropertyStatusChange = (e) => {
  setSelectedPType(e.target.value);
  setSelectedTypes([]); // Reset selectedTypes when property status changes
  setSelectedSort(''); // Reset selected sort when property status changes

};

const handleSortChange = (e) => {
  setSelectedSort(e.target.value); // Update selected sort
};
return (
  <>
  <div className='lists notranslate'>
    <img src='https://storage.googleapis.com/realestate-images/luxury.jpg' className='splash'></img>
    <div className='overlay notranslate'>
      <aside className='screen-1'>
        <button className="toggle" onClick={toggleFilter}> Property Search Filter  
          <div className={`changin ${isRotated && 'rotate'}`}>&#9660;</div>
        </button>
        <form className={`supyo ${showFilter && 'visible'}`} onSubmit={handleSearch}>
          <input className='notranslate' id='search' type='text' placeholder='Enter a City' required />

   
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
  className="notranslate nation"
  id="province"
  placeholder="Select a Province"
  style={{ display: 'block', backgroundColor: selectedProvince ? '#d3d3d3' : 'white' }}
  onChange={(e) => {
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
  <option value="Yukon">Yukon</option>
</select>

  <select
            className="notranslate nation"
            id="state"
            placeholder="Select a State"
            style={{ display: 'none', backgroundColor: selectedState ? '#d3d3d3' : 'white' }}
            onChange={(e) => {
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
<option value="WY">Wyoming</option>
</select>


  <select
            className="notranslate"
            id="choose-search" 
          name="search" 
          placeholder='Property Status Type'
            required
            onChange={handlePropertyStatusChange}
          >
    <option value="" disabled selected>Property Status</option>
    <option value="1">For Rent</option>
    <option value="2">For Sale</option>
    <option value="3">Recently Sold</option>
          </select>


          <div className="custom-checkbox-select">
        <div className="selected-value" onClick={toggleDropdown}>{renderPlaceholderOrSelected()}</div>
        {isDropdownOpen && (
          <div className="options">
            {selectedPType === '1' ? (
              <>
                <label>
                  <input
                    type="checkbox"
                    value="Houses"
                    checked={selectedTypes.includes('Houses')}
                    onChange={() => handleCheckboxChange('Houses')}
                  />
                  Houses
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Townhomes"
                    checked={selectedTypes.includes('Townhomes')}
                    onChange={() => handleCheckboxChange('Townhomes')}
                  />
                  Townhomes
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Apartments_Condos_Co-ops"
                    checked={selectedTypes.includes('Apartments_Condos_Co-ops')}
                    onChange={() => handleCheckboxChange('Apartments_Condos_Co-ops')}
                  />
                  Condos / Apartments / Co-ops
                </label>
              </>
            ) : (
              <>
                <label>
                  <input
                    type="checkbox"
                    value="Houses"
                    checked={selectedTypes.includes('Houses')}
                    onChange={() => handleCheckboxChange('Houses')}
                  />
                  Houses
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Townhomes"
                    checked={selectedTypes.includes('Townhomes')}
                    onChange={() => handleCheckboxChange('Townhomes')}
                  />
                  Townhomes
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Condos"
                    checked={selectedTypes.includes('Condos')}
                    onChange={() => handleCheckboxChange('Condos')}
                  />
                  Condominiums
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Apartments"
                    checked={selectedTypes.includes('Apartments')}
                    onChange={() => handleCheckboxChange('Apartments')}
                  />
                  Apartments
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Multi-family"
                    checked={selectedTypes.includes('Multi-family')}
                    onChange={() => handleCheckboxChange('Multi-family')}
                  />
                  Multi-family
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="LotsLand"
                    checked={selectedTypes.includes('LotsLand')}
                    onChange={() => handleCheckboxChange('LotsLand')}
                  />
                  Land Lots
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Manufactured"
                    checked={selectedTypes.includes('Manufactured')}
                    onChange={() => handleCheckboxChange('Manufactured')}
                  />
                  Manufactured
                </label>
              </>
            )}
          </div>
        )}
      </div>






      <select
        className="notranslate"
        id="sortList"
        name="sort"
        placeholder="Sort Listings"
        required
        style={{ backgroundColor: selectedSort ? '#d3d3d3' : 'white' }}
        onChange={handleSortChange}
      >
        <option value="" disabled selected>Sort Listings</option>
        <option value="Newest">Newest</option>
        {selectedPType === '1' ? ( // For Rent selected
          <>
            <option value="Payment_High_Low">Ascending - Price</option>
            <option value="Payment_Low_High">Descending - Price</option>
          </>
        ) : ( // For Sale or Recently Sold selected (or no selection)
          <>
            <option value="Price_High_Low">Ascending - Price</option>
            <option value="Price_Low_High">Descending - Price</option>
          </>
        )}
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
{initialDataRef.current && initialDataRef.current.zpids && (
  <div className='capture'>
    {initialDataRef.current.zpids.totalPages > 1 && (
      <button
        className={`prevButton ${initialDataRef.current.zpids.currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePPage}
        disabled={initialDataRef.current.zpids.currentPage === 1}
      >
        Previous Page
      </button>
    )}
    <div className='alone'>{initialDataRef.current.zpids.totalResultCount} Results - Page {initialDataRef.current.zpids.currentPage} of {initialDataRef.current.zpids.totalPages}</div>
    {initialDataRef.current.zpids.totalPages > 1 && (
      <button
        className={`nextButton ${initialDataRef.current.zpids.currentPage === initialDataRef.current.zpids.totalPages ? 'disabled' : ''}`}
        onClick={handleNPage}
        disabled={initialDataRef.current.zpids.currentPage === initialDataRef.current.zpids.totalPages}
      >
        Next Page
      </button>
    )}
  </div>
)}

{initialDataRef.current && initialDataRef.current.zpids && initialDataRef.current.zpids.props.length > 0 ? (
  <div className="cardContainer notranslate">
    {initialDataRef.current.zpids.props.map((property, index) => (
      property && (
        <div
          className="cardi1 notranslate"
          key={index}
          onClick={() => handleOpenLightbox(index)}
        >
          <div className='indigo'>
            <img className='mommy' src={property.imgSrc || noImg} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
          </div>
          <div className="cardText1 notranslate">
            <div className='cDress1 notranslate'> ${formatNumberWithCommas(safeAccess(property, 'price'))} <span className='currency1'>{safeAccess(property, 'currency')}</span></div>
            <div className='holding2 notranslate'>
              <div className='cardBed notranslate'>{safeAccess(property, 'bedrooms')} Beds&nbsp;|</div>
              <div className='cardBaths notranslate'>{safeAccess(property, 'bathrooms')} Baths&nbsp;|</div>
              <div className='cardMls notranslate'>Active: {safeAccess(property, 'daysOnZillow')} day(s)</div>
            </div>
            <div className='cPrice1 notranslate'>{safeAccess(property, 'address')}</div>
          </div>
          <div className="binlay">
            View Property Details
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

          </>
        )}
      </main>

  </div>
  
</div>
</>
);
}

 
export default ForRent;
