import React, { useState, useEffect } from 'react';
import './bio.css';
import woman100 from '../../Assets/Images/woman100.jpg';
import silo from '../../Assets/Images/YourPhotoHEre.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faSquareXTwitter, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import sampleData from '../samples.json';
import sampleData1 from '../samples1.json'
import Contact from '../Contact/Contact';

function Bio() {
  const [bio, setBio] = useState('');

  useEffect(() => {
    fetchBio();
  }, []);
  useEffect(() => {
    const initializeAds = () => {
      if (window.adsbygoogle) {
        window.adsbygoogle.loaded = true;
        for (let i = 0; i < 5; i++) {
          window.adsbygoogle.push({});
        }
      }
    };
    
    const timeoutId = setTimeout(initializeAds, 1000); // Push ads 1 second after page load
    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
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
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="4737530479"></ins>
            </aside>
        <main className='testee'>
          <div className='meteor'>
            <div className='rock'>
            <div className='sun'>
              <img className='mainimg1' src={silo} alt='main' />
              <div className='descTextJ'>Derrick Edowen</div>
              <div className='descTextJ'>Sales Representative</div>
              <div className='descTextJ'>derrickedowen@hotmail.com</div>
              <div className='descTextJ'>647-818-5317</div>
              <div className='descTextJ'>Right at Home Realty</div>
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
              
                <div className='descTextZ'>Derrick Edowen</div>
                <p className='descTextF'>With five years of experience in the fast-paced world of real estate, [Agent's Name] has quickly built a reputation for delivering results. Guided by some of the most seasoned and successful mentors in the industry, he has gained invaluable knowledge, sharp negotiation skills, and a deep understanding of the ever-changing market.

What sets [Agent's Name] apart? His energy, dedication, and client-first approach. Whether you're a first-time homebuyer, a savvy investor, or looking to sell at top dollar, he knows how to make the process seamless and stress-free. With a keen eye for detail, a talent for spotting opportunities, and an unwavering commitment to excellence, [Agent’s Name] doesn’t just close deals—he builds lasting relationships.

Passionate about helping people achieve their real estate dreams, [Agent’s Name] is ready to go the extra mile for you. Let’s turn your real estate goals into reality—reach out today!
              </p>
            </div>
</div>

<div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="2111367130"></ins>
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
                        data-ad-slot="5859040459"></ins>
                </div>
          </main>
          <aside className="rightSidebar">
          <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="3424448807"></ins>
            </aside>
          <Contact />


            </>
            
  );
}

export default Bio;
