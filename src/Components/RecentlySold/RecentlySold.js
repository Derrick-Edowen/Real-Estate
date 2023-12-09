import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import './Index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
//import placeHouse from '../../Assets/Images/placeHouse.jpg'
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function RecentlySold() {
//Images
const [images] = useState([image1, image2, image3, image4, image5]);
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 15000);
  
      return () => clearInterval(interval);
    }, [images]);
    const imageStyle = {
      backgroundImage: `url(${images[currentIndex]})`,
    };
//Mapping
const [apiData, setApiData] = useState([]);
const [infoData, setInfoData] = useState([]);
const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
const [cardIndex, setCardIndex] = useState(0);
const [searchClicked, setSearchClicked] = useState(false); // Track if search is clicked

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
            location: address,
            page: '10',
            status_type: "RecentlySold",
            home_type: propertyType,
            sort: sort,
            minPrice: minPrice,
            maxPrice: maxPrice,
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

        const maxConcurrentRequests = 10;
    const batches = [];
    for (let i = 0; i < zpidList.length; i += maxConcurrentRequests) {
      const batch = zpidList.slice(i, i + maxConcurrentRequests);
      batches.push(batch);
    }
    const infoDataArray = [];
    for (const batch of batches) {
      const zpidPromises = batch.map((zpid) => {
        return axios.get('https://zillow-com1.p.rapidapi.com/property', {
          params: {
            zpid: zpid
          },
          headers: {
            'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        });
      });

      const batchResponses = await Promise.all(zpidPromises);
      const batchInfoData = batchResponses.map((response) => response.data);
      infoDataArray.push(...batchInfoData);
    }

    setInfoData(infoDataArray);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [apiData.props, searchClicked]);
    const handleKeyDown = (event) => {
      if (searchClicked && apiData.props.length > 0) {
        if (event.key === 'ArrowLeft') {
          setCardIndex((prevIndex) => (prevIndex === 0 ? apiData.props.length - 1 : prevIndex - 1));
        } else if (event.key === 'ArrowRight') {
          setCardIndex((prevIndex) => (prevIndex === apiData.props.length - 1 ? 0 : prevIndex + 1));
        }
      }
    };
  return (
      <div className='lists' style={imageStyle}>
      <div className='overlay'>

      <div className='searchBar'>
        <input id='search' type='text' placeholder='City or Neighbourhood' required></input>
        <select id="choose-topic" name="transaction" placeholder='Transaction Type'required>
        <option value="RecentlySold" disabled selected>Recently Sold</option>
        </select>
        <select id="sortList" name="sort" placeholder='Sort Listings'required>
        <option value="" disabled selected>Sort Listings</option>
        <option value="Newest">Newest</option>
        <option value="Price_High_Low">Ascending</option>
        <option value="Price_Low_High">Descending</option>
        <option value="Lot_Size">Lot Size</option>
        <option value="Square_Feet">Square Footage</option>
        </select>
        <select id="choose-type" name="propertyType" placeholder='Property Type'required>
        <option value="" disabled selected>Select a Property Type</option>
        <option value="">Any</option>
        <option value="Houses">Houses</option>
        <option value="Townhomes">Townhomes</option>
        <option value="Condos">Condominiums</option>
        <option value="Apartments">Apartments</option>
        <option value="Multi-family">Multi-family</option>
        <option value="LotsLand">Land</option>
        </select>
        <input type='number' id="min-price"placeholder='Minimum Price'required></input>
        <input type='number' id="max-price"placeholder='Maximum Price'required></input>
        <select id="choose-beds" name="beds" placeholder='Beds'required>
        <option value="" disabled selected>Beds</option>
        <option value="0">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="12">5+</option>
        </select>
        <select id="choose-baths" name="baths" placeholder='Baths'required>
        <option value="" disabled selected>Baths</option>
        <option value="0">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="12">5+</option>
        </select>
        <button className='searchBtn' onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#fafafa",}} /></button>
      </div>
        <div className='maps'>
<APIProvider apiKey='AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'>
  <Map center={position} zoom={10}>
    <Marker position={position}/>
  </Map>
</APIProvider>
        </div>
        <div className='guidance'>
        <h1>Recently Sold Listings:</h1>
        {searchClicked && (
        <>
          <button onClick={() => setCardIndex((prevIndex) => (prevIndex === 0 ? apiData.props.length - 1 : prevIndex - 1))}>
            Previous
          </button>
          <button onClick={() => setCardIndex((prevIndex) => (prevIndex === apiData.props.length - 1 ? 0 : prevIndex + 1))}>
            Next
          </button>
        </>
      )}
        </div>
        {apiData.props && apiData.props.length > 0 && (
      <>
        {/* ... */}
        <div className="cardContainer">
          {searchClicked && infoData && infoData.length > 0 &&
            infoData.slice(cardIndex, cardIndex + 3).map((item, index) => (
              <div className="card" key={index}>
                <img src={apiData.props[cardIndex + index]?.imgSrc} alt={apiData.props[cardIndex + index]?.address} />
                <div className="cardText">
                  <h3>${apiData.props[cardIndex + index]?.price}</h3>
                  <h3>{apiData.props[cardIndex + index]?.address}</h3>
                  <p>Bedrooms: {apiData.props[cardIndex + index]?.bedrooms}</p>
                  <p>Bathrooms: {apiData.props[cardIndex + index]?.bathrooms}</p>
                  <p>Basement Status: {item.resoFacts.basement}</p>
                  <p>{item.description}</p>
                  <p>MLS Number: {item.mlsid}</p>
                  <p>BROKERAGE: {item.brokerageName}</p>
                </div>
              </div>
            ))}
        </div>
        {/* ... */}
      </>
    )}
    </div>
    </div>
    );
}
 
export default RecentlySold;

