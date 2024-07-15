import React from "react";
import './activity.css';
import sampleData from '../samples.json';




function ActiveList() {

    return (<>
<div className="activity">
<div className='descTextJ'> [Your Active / Featured Listings] </div>
              <div className="cardContainer notranslate">
              {sampleData.map((property, index) => (
                <div className="cardi2 notranslate" key={index}>
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
            </> )
}
export default ActiveList;