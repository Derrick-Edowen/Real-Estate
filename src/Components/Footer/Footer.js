import React, { useEffect } from 'react';
import './Index.css'


function Footer() {
  useEffect(() => {
    // Initialize Google Translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
    };

    // Call the initialization function
    window.googleTranslateElementInit();

    // Clean up - remove the global function when the component unmounts
    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);
    return (
      <footer className="feet">
        <div className="transLate" id="google_translate_element"></div>
    </footer>
    );
  }
  
  export default Footer;