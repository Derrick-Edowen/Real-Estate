import React, { useState, useEffect } from 'react';

import './Indexq.css'

const Questions = () => {
  useEffect(() => {
    // Load Google CSE API script dynamically
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=662972074485b44cf'; // Replace with your Search Engine ID
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <>
          <h1 className='qTitle'>Have a Question? Ask Away!</h1>
      <div className="gcse-search"></div>
        </>
  );
};

export default Questions;
