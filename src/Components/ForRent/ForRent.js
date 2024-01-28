import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Contact from '../Contact/Contact';
import './Indexr.css'
import 'bootstrap/dist/css/bootstrap.min.css';
//import placeHouse from '../../Assets/Images/placeHouse.jpg'
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import noImg from '../../Assets/Images/noimg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';

function ForRent() {

//Mapping
const [apiData, setApiData] = useState([]);
const [infoData, setInfoData] = useState([]);
const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
const [cardIndex, setCardIndex] = useState(0);
const [searchClicked, setSearchClicked] = useState(false); // Track if search is clicked
const [isLoading, setIsLoading] = useState(false);
const [selectedCard, setSelectedCard] = useState(null);
const [isExpanded, setIsExpanded] = useState(false);
const [zoomLevel, setZoomLevel] = useState(10); // Set an initial zoom level


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
      setZoomLevel(15); // Set your desired zoom level here
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

  const handleSearch = async () => {
    const address = document.getElementById('search').value;
    const sort = document.getElementById('sortList').value;
    const propertyType = document.getElementById('choose-type').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const maxBeds = document.getElementById('choose-beds').value;
    const maxBaths = document.getElementById('choose-baths').value;
    setSearchClicked(true);
    if (!address || !sort || !propertyType || !minPrice || !maxPrice || !maxBeds || !maxBaths) {
      window.alert('Please fill out all required fields!');
      return;
    }

  const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
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
    } else {
      window.alert('Location Not Found: Try Using More Descriptive Words!');
    }
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
            params: {
              location: address + ", Ontario",
              page: '1',
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
      const maxRequestsPerSecond = 2; // Define the maximum requests per second
      const delayBetweenRequests = 1000 / maxRequestsPerSecond; // Calculate the delay between requests

      const infoDataArray = [];
      for (let i = 0; i < zpidList.length; i++) {
        const zpid = zpidList[i];
        const response = await axios.get('https://zillow-com1.p.rapidapi.com/property', {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        });
        infoDataArray.push(response.data);
        if (i < zpidList.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
        }
      }

      setInfoData(infoDataArray);
      setIsLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false); // Ensure loading state is set to false in case of error
    }
  };

      function adjustTextSize() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          const cardText = card.querySelector('.cardText');
          const cardHeight = card.clientHeight;
          const textHeight = cardText.scrollHeight;
          const fontSize = parseFloat(window.getComputedStyle(cardText).fontSize);
          if (textHeight > cardHeight) {
            const newFontSize = fontSize * (cardHeight / textHeight);
            cardText.style.fontSize = `${newFontSize}px`;
          }
        });
      }
      useEffect(() => {
        adjustTextSize();
      }, [infoData, cardIndex]);
    return (
      
        <div className='lists'>
        <div className='overlay'>
        <main className='fullStage'>
        {isLoading ? (
        <div className="loadingMessage">
        Generating properties! Please wait... &nbsp;&nbsp;<FontAwesomeIcon icon={faHouseUser} beatFade size="2xl" />
      </div>
    ) : (
      <>
        {apiData.props && apiData.props.length > 0 && (
          <div className={`cardContainer ${selectedCard ? 'hidden' : ''}`}>
            {searchClicked && infoData && infoData.length > 0 && (
              apiData.props.map((property, index) => (
                <div className={`cardi ${selectedCard === index ? 'expanded' : ''}`}
                key={index}
                onClick={() => handleCardClick(index)}>
                  <img src={property.imgSrc || noImg}
                    alt={'No Image Available'}/>
                  <div className="cardText">
                      <div className='pPrice'>${property.price}/Month<br /></div>
                      <div className='pAddress'>{property.address}</div>
                    <p>
                      <FontAwesomeIcon icon={faBed} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bedrooms}&nbsp;&nbsp;&nbsp;&nbsp;
                      <FontAwesomeIcon icon={faBath} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bathrooms}&nbsp;&nbsp;&nbsp;&nbsp;
                      <FontAwesomeIcon icon={faClock} size="xs" />&nbsp;{infoData[index]?.timeOnZillow || "Unknown"}<br />
                    </p>
                    
              
                  </div>
                  {selectedCard && (
        <div className="expandedCardContainer">
          {/* Display detailed information from the selected card */}
          <div className="expandedCard">
          <img src={property.imgSrc || noImg}
                    alt={'No Image Available'}/>
          <div className="cardText">
          <p className='pPrice'>${property.price}/Month</p>
            <p className='pAddress'>{property.address}</p>
            <p>
            <FontAwesomeIcon icon={faBed} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bedrooms}&nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faBath} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bathrooms}&nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faClock} size="xs" />&nbsp;{infoData[index]?.timeOnZillow || "Unknown"}<br />
            </p>
            </div>
            {infoData[index]?.description}<br />
                  Parking Status: {infoData[index]?.resoFacts.parkingCapacity} parking space(s)<br />
                  Heating: {infoData[index]?.resoFacts.heating[0]}/{infoData[index]?.resoFacts.heating[1]}<br />
                  Cooling: {infoData[index]?.resoFacts.cooling[0]}<br />
                  MLS#: {infoData[index]?.mlsid}<br />
                  BROKERAGE: {infoData[index]?.brokerageName}<br /><br />
          </div>
        </div>
      )}
          
                </div>
                
              ))
            )}
          </div>
          
        )}
        
      </>
    )}
    </main>
        <aside  className='halves'>
        <div className='searchBar'>
          <input id='search' type='text' placeholder='City or Neighbourhood' required></input>
          <select id="sortList" name="sort" placeholder='Sort Listings'required>
          <option value="" disabled selected>Sort Listings</option>
          <option value="Newest">Newest</option>
          <option value="Payment_High_Low">Ascending - Price</option>
          <option value="Payment_Low_High">Descending - Price</option>
          <option value="Lot_Size">Lot Size</option>
          <option value="Square_Feet">Square Footage</option>
          </select>
          <select id="choose-type" name="propertyType" placeholder='Property Type'required>
          <option value="" disabled selected>Property Type</option>
          <option value="Any">Any</option>
          <option value="Houses">Houses</option>
          <option value="Townhomes">Townhomes</option>
          <option value="Apartments_Condos_Co-ops">Condominiums / Apartments</option>
          </select>
          <input type='number' id="min-price"placeholder='Minimum Price - Ex: $1000'required></input>
          <input type='number' id="max-price"placeholder='Maximum Price - Ex: $4000'required></input>
          <select id="choose-beds" name="beds" placeholder='Beds'required>
          <option value="" disabled selected>Beds<FontAwesomeIcon icon={faBed} size="sm" style={{ color: "#1d1e20" }} /></option>
          <option value="0">Any</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds </option>
          <option value="3">3 Beds</option>
          <option value="4">4 Beds</option>
          <option value="5">5 Beds</option>
          <option value="6">6 Beds</option>
          </select>
          <select id="choose-baths" name="baths" placeholder='Baths'required>
          <option value="" disabled selected>Baths</option>
          <option value="0">Any</option>
          <option value="1">1 Bath</option>
          <option value="2">2 Baths</option>
          <option value="3">3 Baths</option>
          <option value="4">4 Baths</option>
          <option value="5">5 Baths</option>
          <option value="6">6 Baths</option>
          </select>
          <button className='searchBtn' onClick={handleSearch}>Search&nbsp;&nbsp;<FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#fafafa",}} /></button>
        </div>
        <div className='map'>
<APIProvider apiKey='AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'>
  <Map center={position} zoom={zoomLevel}>
    <Marker position={position}/>
  </Map>
</APIProvider>
        </div>
        </aside>
        
        
  </div>
  
</div>

);
}

 
export default ForRent;
/*
<div className='lists'>
        <div className='overlay'>
        <main className='fullStage'>
        {isLoading ? (
        <div className="loadingMessage">
        Generating properties! Please wait... &nbsp;&nbsp;<FontAwesomeIcon icon={faHouseUser} beatFade size="2xl" />
      </div>
    ) : (
      <>
        {apiData.props && apiData.props.length > 0 && (
          <div className="cardContainer">
            {searchClicked && infoData && infoData.length > 0 && (
              apiData.props.map((property, index) => (
                <div
                      className={`cardi ${expandedCard === index ? 'expanded' : ''}`}
                      key={index}
                      
                    >
                  <img src={property.imgSrc || noImg}
                    alt={'No Image Available'}
                    />
                  <div className="cardText">
                      <div className='pPrice'>${property.price}/Month<br /></div>
                      <div className='pAddress'>{property.address}</div>
                    <p>
                      <FontAwesomeIcon icon={faBed} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bedrooms}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <FontAwesomeIcon icon={faBath} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bathrooms}<br />

                    </p>
                  </div>
                  <p className='exButt' onClick={() => handleCardClick(index)}>Expand</p>

                  {expandedCard === index && (
                        <div className="expandedCard">
<div className='pPrice'>${property.price}/Month<br /></div>
                      <div className='pAddress'>{property.address}</div>
                    <p>
                      <FontAwesomeIcon icon={faBed} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bedrooms}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <FontAwesomeIcon icon={faBath} size="lg" style={{ color: "#1d1e20" }} />&nbsp; {property.bathrooms}<br />
                    </p>                          {infoData[index]?.description}<br />
                  Parking Status: {infoData[index]?.resoFacts.parkingCapacity} parking space(s)<br />
                  Heating: {infoData[index]?.resoFacts.heating[0]}/{infoData[index]?.resoFacts.heating[1]}<br />
                      Cooling: {infoData[index]?.resoFacts.cooling[0]}
                  MLS#: {infoData[index]?.mlsid}<br />
                  BROKERAGE: {infoData[index]?.brokerageName}<br /><br />
                  <p>
                  <Link
        to={{
          pathname: '/Contact', // Update the pathname as per your route setup
          search: `?address=${encodeURIComponent(property.address)}&price=${encodeURIComponent(property.price)}`,
        }}
      >      
        Ask John Smith about {property.address}?
        </Link>
      </p>
      <button className='exButt1' onClick={() => handleCardClick(index)}>Close</button>


                          </div>
                          )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
      </main>
     




      {infoData[index]?.description}<br />
                  Parking Status: {infoData[index]?.resoFacts.parkingCapacity} parking space(s)<br />
                  Heating: {infoData[index]?.resoFacts.heating[0]}/{infoData[index]?.resoFacts.heating[1]}<br />
                  Cooling: {infoData[index]?.resoFacts.cooling[0]}<br />
                  MLS#: {infoData[index]?.mlsid}<br />
                  BROKERAGE: {infoData[index]?.brokerageName}<br /><br />
      */