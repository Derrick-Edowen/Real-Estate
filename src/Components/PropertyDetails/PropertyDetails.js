import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import noImg from '../../Assets/Images/noimg.jpg'
import '../../search.css'
import './propDetails.css'
import { useParams, useLocation } from 'react-router-dom';
import Contact from '../Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const PropertyDetails = () => {
    const { address } = useParams();
  
    const [property, setProperty] = useState(null);
    const [infoData, setInfoData] = useState({});
    const [api, setApi] = useState(null);
    const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
    const [zoomLevel, setZoomLevel] = useState(11);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const [visibleComponent, setVisibleComponent] = useState('none');

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
                <div className='cardAsk notranslate'>&nbsp;Listing provided courtesy of: {safeAccess(api, 'brokerageName')}</div>
  
              </div>
              <div className="cardText notranslate">
                <div className='containText notranslate'>
                  <div className='pPrice notranslate'>${formatNumberWithCommas(safeAccess(api, 'price'))}/Month</div>
                  <div className='heallin'>
                    <div className='bedd'>&nbsp;{safeAccess(api, 'bedrooms')}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div className='bathh'>&nbsp;{safeAccess(api, 'bathrooms')}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div className='dayss'>&nbsp; Active ({safeAccess(api, 'timeOnZillow')})</div>
                  </div>

                  <div className='holding1 notranslate'>
                    <div className='cardPark notranslate'>&nbsp;Allocated Parking Spaces - {safeAccess(api, 'resoFacts.parkingCapacity')}</div>
                    <div className='cardFire notranslate'>&nbsp;Heating Status - {safeAccess(api, 'resoFacts.heating.0')} &nbsp;</div>
                    <div className='cardWind notranslate'>&nbsp;Cooling Status - {safeAccess(api, 'resoFacts.cooling.0')}&nbsp;</div>
                    <div className='cardMl notranslate'>&nbsp;MLS&reg;: {safeAccess(api, 'mlsid')}&nbsp;</div>
                    <div className='cardBroke notranslate'>&nbsp;Built in: {safeAccess(api, 'yearBuilt')}</div>

                  </div>
                </div>
              </div>
            </div>
            <div className='mr'>
                  <div className='detts'>Property Details</div>
                  <div className='descText notranslate'>{safeAccess(api, 'description')}</div>
                  </div>
          </>
        )}
    <div>
      <div className="buttonp-container">
        <button onClick={() => handleMissClick('map')}>Map</button>
        <button onClick={() => handleMissClick('schools')}>Schools</button>
        <button onClick={() => handleMissClick('homes')}>Nearby Homes</button>
      </div>
      {visibleComponent === 'map' && (
        <div className="map">
          <APIProvider apiKey={apiKey}>
            <Map center={position} zoom={zoomLevel} style={{ width: '100%', height: '400px' }}>
              <Marker position={position} />
            </Map>
          </APIProvider>
        </div>
      )}
      {visibleComponent === 'schools' && (
        <div className="schools">
        {schools.length > 0 ? (
          schools.map((school, index) => (
            <div className="school-card" key={index}>
              <div><strong>Name:</strong> {school.name}</div>
              <div><strong>Type:</strong> {school.type}</div>
              <div><strong>Level:</strong> {school.level}</div>
              <div><strong>Grades:</strong> {school.grades}</div>
              <div><strong>Distance:</strong> {school.distance}</div>
              <div><strong>Rating:</strong> {school.rating}</div>
              <div><strong>Link:</strong> <a href={school.link} target="_blank" rel="noopener noreferrer">{school.link}</a></div>
            </div>
          ))
        ) : (
          <div>No Local School Data</div>
        )}
      </div>
      )}
      {visibleComponent === 'homes' && (
        <div className="nearby-homes">
         {nearbyHomes.length > 0 ? (
            nearbyHomes.map((nearbyHomes, index) => (
              <div key={index}>{nearbyHomes.address.streetAddress} &nbsp; {nearbyHomes.address.zipcode} &nbsp; {nearbyHomes.address.city} &nbsp; {nearbyHomes.address.state}</div>
            ))
          ) : (
            <div>No Nearby Homes Found</div>
          )}
        </div>
      )}
    </div>
      </div>
</>
    );
  };
  
  export default PropertyDetails;
