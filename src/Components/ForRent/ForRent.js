import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import '../../search.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import noImg from '../../Assets/Images/noimg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight, faRepeat} from '@fortawesome/free-solid-svg-icons';
import FadeLoader from "react-spinners/FadeLoader";


function ForRent() {

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
    setSelectedCard(apiData.props[index]);
    
    (async () => {
      // Update map location when a card is clicked
      const selectedProperty = apiData.props[index];
      await updateMapLocation(selectedProperty.address);
    })();
  };
 
  const handleSearch = async (e) => {
    e.preventDefault();
    setShowFilter(false);

    const address = document.getElementById('search').value;
    const state = document.getElementById('state').value;
    const sort = document.getElementById('sortList').value;
    const propertyType = document.getElementById('choose-type').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const maxBeds = document.getElementById('choose-beds').value;
    const maxBaths = document.getElementById('choose-baths').value;
    setSearchClicked(true);

    if (minPrice > maxPrice) {
      window.alert('MAXIMUM PRICE MUST BE GREATER THAN MINIMUM PRICE! PLEASE TRY AGAIN!');
      return;
    }


  const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    setIsLoading(true); 

    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const { results } = data;
    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      setPosition({ lat, lng });
    } else {
      window.alert('Location Not Found: Try Using More Descriptive Words!');
      setIsLoading(false); 
    }
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
            params: {
              location: address+","+state,
              page: 1,
              status_type: "ForRent",
              home_type: propertyType,
              sort: sort,
              rentMinPrice: minPrice,
              rentMaxPrice: maxPrice,
              bathsMax: maxBaths,
              bedsMax: maxBeds
            },
            headers: {
              'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
              'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            },
          });
          
          setApiData(estateResponse.data); 
          const zpidList = estateResponse.data.props.map((item) => item.zpid);
  const maxRequestsPerSecond = 6;
  const delayBetweenRequests = 2000 / maxRequestsPerSecond;

  const infoDataArray = [];
const imageUrlsArray = [];

const fetchPropertyData = async (zpid) => {
  const apiKey = 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7';
  const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
  const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

  const propertyResponse = await axios.get(propertyUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
    }
  });

  // Introduce a delay before making the second request
  await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

  const imageResponse = await axios.get(imagesUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
    }
  });

  return { property: propertyResponse.data, images: imageResponse.data };

};

for (let i = 0; i < zpidList.length; i++) {
  const zpid = zpidList[i];
  const { property, images } = await fetchPropertyData(zpid);

  // Use property and images data as needed
  infoDataArray.push({ ...property, images });
  imageUrlsArray.push(images);

  if (i < zpidList.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
  }
}

setInfoData(infoDataArray);
setImageUrls(imageUrlsArray);
  setIsLoading(false);
} catch (error) {
  console.error('Error fetching data:', error);
  setIsLoading(false);
}
setSearchTrigger(prevState => !prevState); // Toggle the state variable to trigger re-render
if (apiData.props && apiData.props.length === 0) {
  setNoResults(true); // Set noResults to true if no results are available
} else {
  setNoResults(false); // Set noResults to false if results are available
}
};

      const handleOpenLightbox = (index) => {
        setSelectedCardIndex(index);
        setLightboxActive(true);
        setCurrentImageIndex(0); // Reset the current image index when opening the lightbox
        (async () => {
      // Update map location when a card is clicked
      const selectedProperty = apiData.props[index];
      await updateMapLocation(selectedProperty.address);
    })();
      };
    
      const handleCloseLightbox = () => {
        setSelectedCardIndex(null);
        setLightboxActive(false);
      };
      const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % imageUrls[selectedCardIndex].images.length;
        setCurrentImageIndex(nextIndex);
      };
      
      const handlePrevImage = () => {
        const prevIndex = (currentImageIndex - 1 + imageUrls[selectedCardIndex].images.length) % imageUrls[selectedCardIndex].images.length;
        setCurrentImageIndex(prevIndex);
      };
      const formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const toggleFilter = () => {
      setShowFilter(!showFilter);
      setIsRotated(!isRotated);

  };
  function safeAccess(obj, path) {
    if (!path || typeof path !== 'string') {
      return "Unavailable";
    }
    return path.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : "Unavailable"), obj);
  }
    return (
      
        <div className='lists notranslate'>
        <div className='overlay notranslate'>
        <aside className='screen-1'>
          <div className='starter'>For Lease Listings Search</div>
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
    option.textContent = option.textContent.replace('✅', '');
  });
  // Add the green check mark to the selected option
  selectedOption.textContent = `${selectedOption.textContent}        ✅`;

  // Add logic to show/hide and update the id attribute of the province/state select based on the selected country
  const provinceSelect = document.getElementById('province');
  const stateSelect = document.getElementById('state');
  if (selectedOption.value === 'Canada') {
    provinceSelect.style.display = 'block'; // Show the province select
    provinceSelect.setAttribute('id', 'province'); // Update id to province
    stateSelect.style.display = 'none'; // Hide the state select
    stateSelect.removeAttribute('id'); // Remove id attribute
  } else if (selectedOption.value === 'USA') {
    provinceSelect.style.display = 'none'; // Hide the province select
    provinceSelect.removeAttribute('id'); // Remove id attribute
    stateSelect.style.display = 'block'; // Show the state select
    stateSelect.setAttribute('id', 'state'); // Update id to state
  } else {
    provinceSelect.style.display = 'none'; // Hide both selects if neither Canada nor USA is selected
    provinceSelect.removeAttribute('id'); // Remove id attribute
    stateSelect.style.display = 'none';
    stateSelect.removeAttribute('id'); // Remove id attribute
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
  <option value="Yukon">Yukon</option>
</select>
<select
  className="notranslate"
  id="state"
  placeholder="Select a State"
  style={{ display: 'none' }} // Initially hide the state select
  required
>
    {/* Options for USA states */}
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
    {/* Add more options for other states */}
  </select>
                  <select
  className="notranslate"
  id="sortList"
  name="sort"
  placeholder="Sort Listings"
  required
  onChange={(e) => {
    const selectElement = e.target;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    // Remove the green check mark from all options
    selectElement.querySelectorAll('option').forEach(option => {
      option.textContent = option.textContent.replace('✅', '');
    });
    // Add the green check mark to the selected option
    selectedOption.textContent = `${selectedOption.textContent}        ✅`;
  }}
>                      <option value="" disabled selected>Sort Listings</option>
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
                        option.textContent = option.textContent.replace('✅', '');
                      });
                      // Add the green check mark to the selected option
                      selectedOption.textContent = `${selectedOption.textContent}        ✅`;
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
                        option.textContent = option.textContent.replace('✅', '');
                      });
                      // Add the green check mark to the selected option
                      selectedOption.textContent = `${selectedOption.textContent}        ✅`;
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
                        option.textContent = option.textContent.replace('✅', '');
                      });
                      // Add the green check mark to the selected option
                      selectedOption.textContent = `${selectedOption.textContent}      ✅`;
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
            Please wait...&nbsp;&nbsp;
            <FadeLoader color="#f5fcff" margin={0} />
          </div>
        ) : (
          <>
            {apiData.props && apiData.props.length > 0 ? (
  <div className="cardContainer notranslate">
    {searchClicked && infoData && infoData.length > 0 && (
      apiData.props.map((property, index) => (
        property && ( // Check if property is not null/undefined
          <div
            className="cardi1 notranslate"
            key={index}
            onClick={() => handleOpenLightbox(index)}
          >
            <img src={property.imgSrc || noImg} alt={'No Image Available'} style={{ color: 'white', fontSize: '44px', textAlign: 'center', width: '100%'}}/>                      
            <div className="cardText1 notranslate">
              <div className='cDress1 notranslate'>${formatNumberWithCommas(property.price) || "Unavailable"}<br /></div>
              <div className='cPrice1 notranslate'>{property.address || "Unavailable"}</div>
              <div className='holding2 notranslate'>
                <div className='cardBed notranslate'>{property.bedrooms || "Unavailable"} Beds&nbsp;</div>
                <div className='cardBaths notranslate'>{property.bathrooms || "Unavailable"} Baths&nbsp;</div>
                <div className='cardMls notranslate'>MLS&reg;: {infoData[index]?.mlsid || "Unavailable"}</div>
              </div>
            </div>
          </div>
        )
      ))
    )}
  </div>
) : (
  searchClicked && (
    <div className="noResultsMessage">
      Sorry, No results found!
    </div>
  )
)}

{lightboxActive && selectedCardIndex !== null && (
  <div className="lightbox notranslate" onClick={handleCloseLightbox}>
    <div className="lightbox-content notranslate" onClick={(e) => e.stopPropagation()}>
      {/* Lightbox content goes here */}
      {infoData[selectedCardIndex] && imageUrls[selectedCardIndex] && imageUrls[selectedCardIndex].images && (
        <>
        <div className='aver'>
          <div className='pAddress-1 notranslate'>{safeAccess(apiData.props[selectedCardIndex], 'address')}</div>
          <button className="lightbox-close notranslate" onClick={handleCloseLightbox}>
            Close
          </button>
          </div>
          <div className='side-by-side-container notranslate'>
            <div className='fixer notranslate'>
              <button className="lightbox-left notranslate" onClick={handlePrevImage}>
              &#8678;
              </button>
              <img src={imageUrls[selectedCardIndex]?.images[currentImageIndex] || noImg} alt="Sorry, Image Unavailable!" />
              <button className="lightbox-right notranslate" onClick={handleNextImage}>
              &#8680;
              </button> 
            </div> 
            <div className="cardText notranslate">
              <div className='containText notranslate'>
                <div className='pAddress notranslate'>{safeAccess(apiData.props[selectedCardIndex], 'address')}</div>
                <div className='pPrice notranslate'>${safeAccess(apiData.props[selectedCardIndex], 'price')}/Month</div>
              <div className='heallin'>
                <div className='bedd'>&nbsp;{safeAccess(apiData.props[selectedCardIndex], 'bedrooms')}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='bathh'>&nbsp;{safeAccess(apiData.props[selectedCardIndex], 'bathrooms')}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='dayss'>&nbsp; Active ({safeAccess(infoData[selectedCardIndex], 'timeOnZillow')})</div>            
                </div>
                <div className='descText notranslate'>{safeAccess(infoData[selectedCardIndex], 'description')}</div>
                <div className='holding1 notranslate'>
                  <div className='cardPark notranslate'>Parking Status - {safeAccess(infoData[selectedCardIndex], 'resoFacts.parkingCapacity')}</div>
                  <div className='cardFire notranslate'>Heating Status - {safeAccess(infoData[selectedCardIndex], 'resoFacts.heating.0')}/{safeAccess(infoData[selectedCardIndex], 'resoFacts.heating.1')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <div className='cardWind notranslate'>Cooling Status - {safeAccess(infoData[selectedCardIndex], 'resoFacts.cooling.0')}</div>
                  <div className='cardMl notranslate'>MLS&reg;: {safeAccess(infoData[selectedCardIndex], 'mlsid')}</div>
                  <div className='cardBroke notranslate'>Listing Provided by: {safeAccess(infoData[selectedCardIndex], 'brokerageName')}</div>  
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

  </div>
  
</div>

);
}

 
export default ForRent;
