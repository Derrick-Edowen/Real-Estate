import React, { useEffect, useState } from "react";
import '../../search.css'
import Contact from '../Contact/Contact';



function marketSale() {

    return (<>
        <div className="container">
              <h2>Search Market Data by City - Sales</h2>
              
              <input
                type="text"
                placeholder="Enter city name"
                className="input"
              />
              
              <button className="search-button">
                Search
              </button>
            </div>
        
                      <Contact />
        </>)
}
export default marketSale;