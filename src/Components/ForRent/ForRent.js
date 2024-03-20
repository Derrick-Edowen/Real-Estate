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
              location: address +",ontario",
              page: page, // Use the current page number
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
  const maxRequestsPerSecond = 2;
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
                    <div
                      className="cardi1 notranslate"
                      key={index}
                      onClick={() => handleOpenLightbox(index)}
                    >
                    <img src={property.imgSrc || noImg} alt={'No Available Image'} style={{ color: 'white', fontSize: '44px', textAlign: 'center', width: '100%'}}/>                      
                        <div className="cardText1 notranslate">
                        <div className='cDress1 notranslate'>${formatNumberWithCommas(property.price) || "Undisclosed"}<br /></div>
                        <div className='cPrice1 notranslate'>{property.address || "Undisclosed"}</div>
                        <div className='holding2 notranslate'>
                          <div className='cardBed notranslate'>{property.bedrooms || "Undisclosed Number of"} Beds&nbsp;</div>
                          <div className='cardBaths notranslate'>{property.bathrooms || "Undisclosed Number of"} Baths&nbsp;</div>
                          <div className='cardMls notranslate'>MLS&reg;: {infoData[index]?.mlsid || "Unknown"}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              searchClicked && (
                <div className="noResultsMessage">
                  Sorry, No results found! Try different search parameters!
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
                      <div className='pAddress-1 notranslate'>{apiData.props[selectedCardIndex].address || "Undisclosed"}</div>
                      <button className="lightbox-close notranslate" onClick={handleCloseLightbox}>
                        Close
                      </button>
                      </div>
                      <div className='side-by-side-container notranslate'>
                        <div className='fixer notranslate'>
                          <button className="lightbox-left notranslate" onClick={handlePrevImage}>
                          &#8678;
                          </button>
                          <img src={imageUrls[selectedCardIndex].images[currentImageIndex] || noImg} alt="Sorry, Image Not Available!" />
                          <button className="lightbox-right notranslate" onClick={handleNextImage}>
                          &#8680;
                          </button> 
                        </div> 
                        <div className="cardText notranslate">
                          <div className='containText notranslate'>
                            <div className='pAddress notranslate'>{apiData.props[selectedCardIndex].address || "Undisclosed"}</div>
                            <div className='pPrice notranslate'>${apiData.props[selectedCardIndex].price || "Undisclosed"}/Month</div>
                          <div className='heallin'>
                            <div className='bedd'>&nbsp; {apiData.props[selectedCardIndex].bedrooms || "Undisclosed"}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <div className='bathh'>&nbsp; {apiData.props[selectedCardIndex].bathrooms || "Undisclosed"}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <div className='dayss'>&nbsp; Active ({infoData[selectedCardIndex]?.timeOnZillow || "Undisclosed"})</div>            
                            </div>
                            <div className='descText notranslate'>{infoData[selectedCardIndex]?.description}</div>
                            <div className='holding1 notranslate'>
                              <div className='cardPark notranslate'>Parking Status - {infoData[selectedCardIndex]?.resoFacts.parkingCapacity|| "Undisclosed Number of"} parking space(s) &nbsp;&nbsp;  </div>
                              <div className='cardFire notranslate'>Heating Status - {infoData[selectedCardIndex]?.resoFacts.heating[0]}/{infoData[selectedCardIndex]?.resoFacts.heating[1] || "Undisclosed"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                              <div className='cardWind notranslate'>Cooling Status - {infoData[selectedCardIndex]?.resoFacts.cooling[0] || "Undisclosed"}</div>
                              <div className='cardMl notranslate'>MLS&reg;: {infoData[selectedCardIndex]?.mlsid || "Undisclosed"}</div>
                              <div className='cardBroke notranslate'>Listing Provided by: {infoData[selectedCardIndex]?.brokerageName || "Undisclosed"}</div>  
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
