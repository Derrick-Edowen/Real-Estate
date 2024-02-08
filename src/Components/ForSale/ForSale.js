import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Contact from '../Contact/Contact';
import './Indext.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import noImg from '../../Assets/Images/noimg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight, faBed,
 faClock, faBath, faCircleXmark, faHouseUser,  faFire,  faWind,
faSquareParking, faJugDetergent, faRepeat} from '@fortawesome/free-solid-svg-icons';
import FadeLoader from "react-spinners/FadeLoader";


function ForSale() {

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
  const handleReset = () => {
    // Select the input elements and reset their values
    document.getElementById('search').value = '';
    document.getElementById('sortList').value = '';
    document.getElementById('choose-type').value = '';
    document.getElementById('choose-beds').value = '';
    document.getElementById('choose-baths').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
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
      return;
    }
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
            params: {
              location: address + ", Ontario",
              page: '1',
              status_type: "ForSale",
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
  const maxRequestsPerSecond = 2;
  const delayBetweenRequests = 1000 / maxRequestsPerSecond;

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
    return (
      
        <div className='lists'>
        <div className='overlay'>
        <main className='fullStage'>
        {isLoading ? (
        <div className="loadingMessage">
        Please wait...&nbsp;&nbsp;<FadeLoader color="#f5fcff" margin={0}
/>
      </div>
    ) : (
      <>
      {apiData.props && apiData.props.length > 0 && (
        <div className="cardContainer">
          {searchClicked && infoData && infoData.length > 0 && (
            apiData.props.map((property, index) => (
              <div
                className="cardi"
                key={index}
                onClick={() => handleOpenLightbox(index)}
              >
                <img src={property.imgSrc || noImg} alt={'Not Available'} />
                <div className="cardText">
                  <div className='cDress'>${property.price}<br /></div>
                  <div className='cPrice'>{property.address}</div>
                  <p>
                  
                  <FontAwesomeIcon icon={faBed} size="xl" style={{color: "#190000",}} />&nbsp;{property.bedrooms}&nbsp;&nbsp;&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faBath} size="xl" style={{color: "#190000",}}/>&nbsp;{property.bathrooms}&nbsp;&nbsp;&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faClock} size="lg" style={{color: "#190000",}}  />&nbsp;{infoData[index]?.timeOnZillow || "Unknown"}<br />
                </p>
                <p>Click to See More...</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

{lightboxActive && selectedCardIndex !== null && (
  <div className="lightbox" onClick={handleCloseLightbox}>
    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
      {infoData[selectedCardIndex] && imageUrls[selectedCardIndex] && imageUrls[selectedCardIndex].images && (
        <>
        <div className='side-by-side-container'>
          <div className='fixer'>
        <button className="lightbox-left" onClick={handlePrevImage}>
            <FontAwesomeIcon icon={faChevronLeft} size="lg" />
          </button>
          <img src={imageUrls[selectedCardIndex].images[currentImageIndex] || noImg} alt="Sorry, Not Available :(" />
          <button className="lightbox-right" onClick={handleNextImage}>
            <FontAwesomeIcon icon={faChevronRight} size="lg" />
          </button> 
          </div> 
          <div className="cardText">
            <div className='containText'>
          <div className='pAddress'>{apiData.props[selectedCardIndex].address}</div>
          <div className='pPrice'>${apiData.props[selectedCardIndex].price}</div>
        
        <FontAwesomeIcon icon={faBed} size="lg" style={{color: "#492903",}} />&nbsp; {apiData.props[selectedCardIndex].bedrooms}&nbsp;Beds&nbsp;&nbsp;&nbsp;&nbsp;
        <FontAwesomeIcon icon={faBath} size="lg" style={{color: "#492903",}}/>&nbsp; {apiData.props[selectedCardIndex].bathrooms}&nbsp;Baths&nbsp;&nbsp;&nbsp;&nbsp;
        <FontAwesomeIcon icon={faClock} size="lg" style={{color: "#3d0000",}} />&nbsp; {infoData[selectedCardIndex]?.timeOnZillow || "Unknown"} on Market<br />            
        
            {infoData[selectedCardIndex]?.description}<br />
            <FontAwesomeIcon icon={faSquareParking} size="lg" style={{color: "#065b0b",}} /> - {infoData[selectedCardIndex]?.resoFacts.parkingCapacity} parking space(s) &nbsp;&nbsp;
            <FontAwesomeIcon icon={faFire} size="lg" style={{color: "#bf0d0d",}} /> - {infoData[selectedCardIndex]?.resoFacts.heating[0]}/{infoData[selectedCardIndex]?.resoFacts.heating[1]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            MLS&reg;: {infoData[selectedCardIndex]?.mlsid}<br />

            <FontAwesomeIcon icon={faJugDetergent} size="lg" style={{ color: "#012665" }}/> - {infoData[selectedCardIndex]?.resoFacts.laundryFeatures &&infoData[selectedCardIndex]?.resoFacts.laundryFeatures.length > 0? infoData[selectedCardIndex]?.resoFacts.laundryFeatures[0]: "Unknown"}&nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faWind} size="lg" style={{color: "#006bbd",}} /> - {infoData[selectedCardIndex]?.resoFacts.cooling[0]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Brokerage: {infoData[selectedCardIndex]?.brokerageName}      

          </div>
          </div>
          </div>
          <div className='map'>
<APIProvider apiKey='AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'>
  <Map center={position} zoom={zoomLevel} mapTypeId ='hybrid' >
    <Marker position={position}/>
  </Map>
</APIProvider>
        </div>
          
        <button className="lightbox-close" onClick={handleCloseLightbox}>
              <FontAwesomeIcon icon={faCircleXmark} size="xl" />
            </button>         
        </>
      )}
    </div>
  </div>
)}
    </>
    )}
    </main>
        <aside className='searchBar'>
          
          <div class="container">
	<div class="screen">
		<div class="screen__content">
			<div class="login">
      <h5 className='params'>FOR SALE SEARCH</h5>

				<div class="login__field">
          
					<i class="login__icon fas fa-user"></i>
          
          <input className='search1' id='search' type='text' placeholder='Enter a City!' required></input>
				</div>
				<div class="login__field">
					<i class="login__icon fas fa-lock"></i>
          <div className='propsort'>
          <select className='sort1' id="sortList" name="sort" placeholder='Sort Listings'required>
          <option value="" disabled selected>Sort Listings</option>
          <option value="Newest">Newest</option>
          <option value="Payment_High_Low">Ascending - Price</option>
          <option value="Payment_Low_High">Descending - Price</option>
          <option value="Lot_Size">Lot Size</option>
          <option value="Square_Feet">Square Footage</option>
          </select>
          <select className='property1' id="choose-type" name="propertyType" placeholder='Property Type'required>
          <option value="" disabled selected>Property Type</option>
          <option value="">Any</option>
          <option value="Houses">Houses</option>
          <option value="Townhomes">Townhomes</option>
          <option value="Condos">Condominiums</option>
          <option value="Apartments">Apartments</option>
          <option value="Multi-family">Multi-family</option>
          <option value="LotsLand">Land</option>
          </select>
          </div>
          <div className='bedsbaths'>
          <select className='beds1' id="choose-beds" name="beds" placeholder='Beds'required>
          <option value="" disabled selected>Beds</option>
          <option value="0">Any</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds </option>
          <option value="3">3 Beds</option>
          <option value="4">4 Beds</option>
          <option value="5">5 Beds</option>
          <option value="6">6 Beds</option>
          </select>
          <select className='baths1' id="choose-baths" name="baths" placeholder='Baths'required>
          <option value="" disabled selected>Baths</option>
          <option value="0">Any</option>
          <option value="1">1 Bath</option>
          <option value="2">2 Baths</option>
          <option value="3">3 Baths</option>
          <option value="4">4 Baths</option>
          <option value="5">5 Baths</option>
          <option value="6">6 Baths</option>
          </select>
          
          </div>
          <input className='mins1' type='number' id="min-price"placeholder='Minimum Rent Price'required></input>
          <input className='maxs1' type='number' id="max-price"placeholder='Maximum Rent Price'required></input>
				</div>
        <div className='resets'>
          <button className='resetBtn' onClick={handleReset}>Clear&nbsp;&nbsp;<FontAwesomeIcon icon={faRepeat} size="lg" /></button>
          <button className='searchBtn' onClick={handleSearch}>Search&nbsp;&nbsp;<FontAwesomeIcon icon={faMagnifyingGlass}/></button>
          </div>			
			</div>
		</div>
		<div class="screen__background">
			<span class="screen__background__shape screen__background__shape4"></span>
			<span class="screen__background__shape screen__background__shape3"></span>		
			<span class="screen__background__shape screen__background__shape2"></span>
			<span class="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
        </aside> 
  </div>
  
</div>

);
}
 
export default ForSale;



