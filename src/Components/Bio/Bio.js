import React, { useState, useEffect } from 'react';
import './bio.css';
import woman100 from '../../Assets/Images/woman100.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faSquareXTwitter, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import sampleData from '../samples.json';
import sampleData1 from '../samples1.json'
import Contact from '../Contact/Contact';

function Bio() {
  const [bio, setBio] = useState('');

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
    <div className="biol">
      <img src='https://storage.googleapis.com/realestate-images/luxury.jpg' className='splasher1' alt='Background'></img>
      <div className='splasher-overlay'>
        <div className='testee'>
          <div className='boutme'>
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
              
                <div className='descTextZ'>[About Me / Your Name]</div>
                <p className='descTextF'>{bio}
              </p>
            </div>
            <div className='plant'>
              <div className='descTextJ'> [My Active / Featured Listings] </div>
              <div className="cardContainer notranslate">
                {sampleData.map((property, index) => (
                  <div className="cardi1 notranslate" key={index}>
                    <div className='indigo'>
                      <img className='mommy' src={property.imgSrc} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
                    </div>
                    <div className="cardText1 notranslate">
                      <div className='cDress1 notranslate'> ${property.price} <span className='currency1'>{property.currency}</span></div>
                      <div className='holding2 notranslate'>
                        <div className='cardBed notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                        <div className='cardBaths notranslate'>{property.bathrooms} Baths&nbsp;|</div>
                        <div className='cardMls notranslate'>Active: {property.daysOnZillow} day(s)</div>
                      </div>
                      <div className='cPrice1 notranslate'>{property.address}</div>
                    </div>
                    <div className="binlay">
                      [Sample Purposes Only]
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='plant'>
              <div className='descTextJ'> [My Recently Sold Listings] </div>
              <div className="cardContainer notranslate">
                {sampleData1.map((property, index) => (
                  <div className="cardi1 notranslate" key={index}>
                    <div className='indigo'>
                      <img className='mommy' src={property.imgSrc} alt={'Photo Not Available'} style={{ color: 'black', fontSize: '70px', textAlign: 'center', width: '100%' }} />
                    </div>
                    <div className="cardText1 notranslate">
                      <div className='cDress1 notranslate'> ${property.price} <span className='currency1'>{property.currency}</span></div>
                      <div className='holding2 notranslate'>
                        <div className='cardBed notranslate'>{property.bedrooms} Beds&nbsp;|</div>
                        <div className='cardBaths notranslate'>{property.bathrooms} Baths&nbsp;|</div>
                        <div className='cardMls notranslate'>Active: {property.daysOnZillow} day(s)</div>
                      </div>
                      <div className='cPrice1 notranslate'>{property.address}</div>
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
      </div>
    </div>
            <Contact />
            </>
  );
}

export default Bio;
