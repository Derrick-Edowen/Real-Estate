import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import noImg from '../../Assets/Images/noimg.jpg'
import '../../search.css'
import './propDetails.css'
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { address } = useParams();

    const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
  const [zoomLevel, setZoomLevel] = useState(11);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const queryParams = new URLSearchParams(window.location.search);
  const data = JSON.parse(decodeURIComponent(queryParams.get('data')));

  const { property, info, api } = data;
  const infoData = info ? info : {}; // Ensure infoData is properly set
  const selectedCardIndex = 0;  // Since we're only displaying one property

  // Log the received data
  useEffect(() => {
    console.log("Property Data:", property);
    console.log("Info Data:", infoData);
    console.log("API Data:", api);
    const address = `${safeAccess(api, 'address.streetAddress')} ${safeAccess(api, 'address.zipcode')} ${safeAccess(api, 'address.city')} ${safeAccess(api, 'address.state')}`;
    updateMapLocation(address);
}, []);
  const safeAccess = (object, path) => {
    return path.split('.').reduce((o, p) => (o && o[p] ? o[p] : ''), object);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCloseLightbox = () => {
    window.close();
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

  return (
    <div className='propDets'>
      {api && (
        <>
          <div className='aver'>
            <div className='pAddress-1 notranslate'>
              {safeAccess(api, 'address.streetAddress') + " " + safeAccess(api, 'address.zipcode') + " - " +
                safeAccess(api, 'address.city') + " , " + safeAccess(api, 'address.state')}
            </div>
            <button className="lightbox-close notranslate" onClick={handleCloseLightbox}>
              Close
            </button>
          </div>
          <div className='side-by-side-container notranslate'>
            <div className='fixer notranslate'>
              <button className="lightbox-left notranslate" onClick={handlePrevImage}>
                &#8678;
              </button>
              <img src={infoData.images ? infoData.images[currentImageIndex] : noImg} alt="Sorry, Image Unavailable!" />
              <button className="lightbox-right notranslate" onClick={handleNextImage}>
                &#8680;
              </button>
            </div>
            <div className="cardText notranslate">
              <div className='containText notranslate'>
                <div className='pAddress notranslate'>{safeAccess(api, 'address.streetAddress') + " " + safeAccess(api, 'address.zipcode')}</div>
                <div className='pPrice notranslate'>${formatNumberWithCommas(safeAccess(api, 'price'))}/Month</div>
                <div className='heallin'>
                  <div className='bedd'>&nbsp;{safeAccess(api, 'bedrooms')}&nbsp;Bed(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <div className='bathh'>&nbsp;{safeAccess(api, 'bathrooms')}&nbsp;Bath(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <div className='dayss'>&nbsp; Active ({safeAccess(api, 'timeOnZillow')})</div>
                </div>
                <div className='descText notranslate'>{safeAccess(api, 'description')}</div>
                <div className='holding1 notranslate'>
                  <div className='cardPark notranslate'>&nbsp;Allocated Parking Spaces - {safeAccess(api, 'resoFacts.parkingCapacity')}</div>
                  <div className='cardFire notranslate'>&nbsp;Heating Status - {safeAccess(api, 'resoFacts.heating.0')} &nbsp;</div>
                  <div className='cardWind notranslate'>&nbsp;Cooling Status - {safeAccess(api, 'resoFacts.cooling.0')}&nbsp;</div>
                  <div className='cardMl notranslate'>&nbsp;MLS&reg;: {safeAccess(api, 'mlsid')}&nbsp;</div>
                  <div className='cardBroke notranslate'>&nbsp;Listing Provided by: {safeAccess(api, 'brokerageName')}&nbsp;</div>
                </div>
              </div>
            </div>
          </div>
          <div className='map notranslate'>
              <APIProvider apiKey={apiKey}>
                <Map center={position} zoom={zoomLevel} mapTypeId='hybrid'>
                  <Marker position={position} />
                </Map>
              </APIProvider>
            </div>
          </>
        )}
      </div>
    );
  }
  
  export default PropertyDetails;
