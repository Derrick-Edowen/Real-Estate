import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import noImg from '../../Assets/Images/noimg.jpg'
import '../../search.css'
import './propDetails.css'
import { useParams, useLocation } from 'react-router-dom';
import Contact from '../Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowLeft, faArrowRight, faChevronDown, faCircle, faEye } from '@fortawesome/free-solid-svg-icons';

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


    useEffect(() => {
      const storedData = sessionStorage.getItem('propertyData');
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
    const nearbyHomes = safeAccess(api, 'nearbyHomes', []);
    const monthlyPrice = safeAccess(api, 'price', 0);
    const yearlyPrice = monthlyPrice * 12;
    const hasPetsAllowed = safeAccess(api, 'resoFacts.hasPetsAllowed');
const garage = safeAccess(api, 'resoFacts.hasGarage');
const furnished = safeAccess(api, 'resoFacts.furnished');
const homeType = safeAccess(api, 'homeType')?.replace(/_/g, ' '); // Replace underscores with spaces

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
                <div className='pPrice notranslate'>${formatNumberWithCommas(monthlyPrice)}/Month</div>
                <div className='pminiPrice notranslate'>Est. ${formatNumberWithCommas(yearlyPrice)} annually</div>
                  <div className='heallin'>
                    <div className='bedd'>{safeAccess(api, 'bedrooms')}&nbsp;Bed(s)</div>
                    <div className='bathh'>{safeAccess(api, 'bathrooms')}&nbsp;Bath(s)</div>
                  </div>
                  <div className='dayss'><FontAwesomeIcon icon={faCircle} style={{color: "#00a303",}} />&nbsp; Active ({safeAccess(api, 'timeOnZillow')})</div>
                  <div className='holding1 notranslate'>

                  <div className='descTextF notranslate'>MLS&reg;: {safeAccess(api, 'mlsid')}</div>
                  <div className='descTextF notranslate'><FontAwesomeIcon icon={faEye} />&nbsp;Views: {safeAccess(api, 'pageViewCount')}</div>
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
          className={`toggle-button ${visibleComponent === 'homes' ? 'active' : ''}`}
          onClick={() => handleMissClick('homes')}
        >
          Nearby Homes
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
        className="school-card-link"
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
          <div className='noSchool'>Sorry, No Local School Data!</div>
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
            style={{ backgroundImage: `url(${home.miniCardPhotos[0].url})` }}
            alt='No Image Available'
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
        <div>No Nearby Homes Found!</div>
      )}
    </div>
      )}
    </div>
      </div>
</>
    );
  };
  
  export default PropertyDetails;
