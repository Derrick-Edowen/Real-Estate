import React, { useState, useEffect } from 'react';
import './activity.css';
import sampleData from '../samples.json';
import sampleData2 from '../samples1.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';



function ActiveList() {
  const [currentContent, setCurrentContent] = useState('active');
  const [transitionClass, setTransitionClass] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitionClass('fade-out');
      setTimeout(() => {
        setCurrentContent((prevContent) => (prevContent === 'active' ? 'sold' : 'active'));
        setTransitionClass('fade-in');
      }, 1500); // Match this duration with your CSS transition duration
    }, 18000);

    return () => clearInterval(interval);
  }, []);
    return (<>
<div className="activity">
{currentContent === 'active' ? (
        <>
          <div className='descTextJ'> [ My Featured Listings ] </div>
          <div className="cardContainer2 notranslate">
            {sampleData.map((property, index) => (
              <div className="cardi2 notranslate" key={index}>
                <div className='indigo'>
                  <img
                    className='mommy'
                    src={property.imgSrc}
                    alt={'Photo Not Available'}
                    style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }}
                  />
                </div>
                <div className="cardText1 notranslate">
                  <div className='descTexco1 notranslate'>{property.address}</div>
                  <div className='holding2 notranslate'>
                    <div className='descTexcop1 notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                    <div className='descTexcop1 notranslate'>{property.bathrooms} Baths&nbsp;</div>
                  </div>
                  <div className='descTextJln1 notranslate'>
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#0c6b00" }} /> Active: {property.daysOnZillow} day(s)
                  </div>
                  <div className='descTextJlnv1 notranslate'>
                    ${property.price}<span className='currency11'>{property.currency}</span>
                  </div>
                </div>
                <div className="binlay">
                  [ Sample Purposes Only ]
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className='descTextJ'> [ My Recently Sold Listings ] </div>
          <div className="cardContainer2 notranslate">
            {sampleData2.map((property, index) => (
              <div className="cardi2 notranslate" key={index}>
                <div className='indigo'>
                  <img
                    className='mommy'
                    src={property.imgSrc}
                    alt={'Photo Not Available'}
                    style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }}
                  />
                </div>
                <div className="cardText1 notranslate">
                  <div className='descTexco1 notranslate'>{property.address}</div>
                  <div className='holding2 notranslate'>
                    <div className='descTexcop1 notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                    <div className='descTexcop1 notranslate'>{property.bathrooms} Baths&nbsp;</div>
                  </div>
                  <div className='descTextJln1 notranslate'>
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#0c6b00" }} /> Active: {property.daysOnZillow} day(s)
                  </div>
                  <div className='descTextJlnv1 notranslate'>
                    ${property.price}<span className='currency11'>{property.currency}</span>
                  </div>
                </div>
                <div className="binlay">
                  [ Sample Purposes Only ]
                </div>
              </div>
            ))}
          </div>
        </>
      )}
            </div>
            </> )
}
export default ActiveList;