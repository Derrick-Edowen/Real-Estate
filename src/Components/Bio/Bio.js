import React, { useState, useEffect } from 'react';
import './bio.css';
import woman100 from '../../Assets/Images/woman100.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faSquareXTwitter, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import sampleData from '../samples.json';
import sampleData1 from '../samples1.json'
import Contact from '../Contact/Contact';

function Bio() {
  const [bio, setBio] = useState('');
  useEffect(() => {
    if (window.adsbygoogle) {
        window.adsbygoogle.push({});
    }
}, []);
  useEffect(() => {
    fetchBio();
  }, []);

  const fetchBio = async () => {
    try {
      const response = await fetch('/bio');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBio(data[0]?.bio || '');
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  return (<>
<aside className="leftSidebar">
<ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="2071134414"></ins>
            </aside>
        <main className='testee'>
          <div className='meteor'>
            <div className='rock'>
            <div className='sun'>
              <img className='mainimg1' src={woman100} alt='main' />
              <div className='descTextJ'>[Your Name]</div>
              <div className='descTextJ'>[Sales Representative / Broker]</div>
              <div className='descTextJ'>[Email Address]</div>
              <div className='descTextJ'>[Phone Number]</div>
              <div className='descTextJ'>[Office / Brokerage Address]</div>
              <div className='descTextJ'>[Office Number]</div>
              <div className='sci-hero1'>
                <span><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} size="xl" style={{ color: "#94004f" }} /></a></span>
                <span><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} size="xl" style={{ color: "#032e77" }} /></a></span>
                <span><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSquareXTwitter} size="xl" style={{ color: "#2e2e2e" }} /></a></span>
                <span><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{ color: "#000000" }} size='xl' /></a></span>
                <span><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} size="xl" style={{ color: "#072b69" }} /></a></span>
                <span><a href='https://www.youtube.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} size="xl" style={{color: "#d00101",}} /></a></span>
              </div>
            </div>
            <div className='moon'>
              
                <div className='descTextZ'>[ Your Name ]</div>
                <p className='descTextF'>{bio}
              </p>
            </div>
</div>

<div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="3483717615"></ins>
                </div>


            <div className='cookem'>
            <div className='plant'>
            <div className='descTextJ'> Featured Listings </div>
              <div className="cardContainer notranslate">
              {sampleData.map((property, index) => (
                <div className="cardi2 notranslate" key={index}>
                  <div className='indigo'>
                    <img className='mommy' src={property.imgSrc} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
                  </div>
                  <div className="cardText1 notranslate">
                  <div className='descTexco1 notranslate'>{property.address}</div>
                    <div className='holding2 notranslate'>
                      <div className='descTexcop1 notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                      <div className='descTexcop1 notranslate'>{property.bathrooms} Baths&nbsp;</div>
                    </div>
                    <div className='descTextJln1 notranslate'><FontAwesomeIcon icon={faCircleCheck} style={{color: "#0c6b00",}} /> Active: {property.daysOnZillow} day(s)</div>
                    <div className='descTextJlnv1 notranslate'> ${property.price}<span className='currency11'>{property.currency}</span></div>
                  </div>
                  <div className="binlay">
                    [Sample Purposes Only]
                  </div>
                </div>
              ))}
            </div>
            </div>
            <div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="3483717615"></ins>
                </div>
            <div className='plant'>
              <div className='descTextJ'> Recently Sold Listings </div>
              <div className="cardContainer notranslate">
              {sampleData1.map((property, index) => (
                <div className="cardi2 notranslate" key={index}>
                  <div className='indigo'>
                    <img className='mommy' src={property.imgSrc} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
                  </div>
                  <div className="cardText1 notranslate">
                  <div className='descTexco1 notranslate'>{property.address}</div>
                    <div className='holding2 notranslate'>
                      <div className='descTexcop1 notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                      <div className='descTexcop1 notranslate'>{property.bathrooms} Baths&nbsp;</div>
                    </div>
                    <div className='descTextJln1 notranslate'><FontAwesomeIcon icon={faCircleXmark} style={{color: "#bb1907",}} /> Sold: {property.daysOnZillow} day(s) ago</div>
                    <div className='descTextJlnv1 notranslate'> ${property.price}<span className='currency11'>{property.currency}</span></div>
                  </div>
                  <div className="binlay">
                    [Sample Purposes Only]
                  </div>
                </div>
              ))}
            </div>
            </div>
            </div>

            </div>
            <div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="3483717615"></ins>
                </div>
          </main>
          <aside className="rightSidebar">
          <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="7895989687"></ins>
            </aside>
          <Contact />


            </>
            
  );
}

export default Bio;
