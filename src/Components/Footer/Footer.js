import React, { useEffect } from 'react';
import './Index.css'
import QRcode from '../../Assets/Images/QRCODE.png'

function Footer() {
    return (
      <div className="feet">
        <div className="transLate">NOTICE: This website is a live sample/template. All rights to this content are reserved for One Estate Web Services. To setup
         your own personal website and increase your online presence, please contact One Estate Web Services at 
        OneEstate@webservices.com to get started today.</div>
        <img className='QR' src={QRcode}></img>
    </div>
    );
  }
  
  export default Footer;