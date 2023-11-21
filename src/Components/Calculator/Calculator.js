import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import MortgageCalculator from "mortgage-calculator-react";
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
//import customStyle from "./customStyle";
import './Index.css'

function Calculator() {
    const [images] = useState([image1, image2, image3, image4, image5]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 15000);
  
      return () => clearInterval(interval);
    }, [images]);
  
    const imageStyle = {
      backgroundImage: `url(${images[currentIndex]})`,
    };
  
    return (
    <div className='mortCalc'>
        <div className="calc" style={imageStyle}>

<div className='mortgC'>
<MortgageCalculator  interestRate={0.035} price={0} downPayment={0} mortgageInsuranceEnabled={false}/>
<div className='disclaimer'>
<p>"Please note that any monthly mortgage value calculated from this calculator
     is an estimate and intended for informational purposes only. Your actual mortgage
      payment may vary based on a multitude of factors, including but not limited to changes
in interest rates, loan terms, taxes, insurance, additional fees, and individual financial
circumstances. Consult with a qualified financial advisor or mortgage
 lender for precise and personalized calculations."
</p>
</div>
</div>
</div>
</div>
    );
    
}

export default Calculator;