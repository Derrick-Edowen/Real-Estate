import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Header from '../Header/Header';
import './Index.css'
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'




function Listings() {
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
    const [city, setCity] = useState('');
    const [position, setPosition] = useState([0, 0]); // Default position
  
    const handleCityChange = (event) => {
      setCity(event.target.value);
    };
    const handleSearch = async () => {
      try {
        // Use your geocoding service API to get latitude and longitude for the city
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const data = await response.json();
  
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          alert('City not found!');
        }
      } catch (error) {
        console.error('Error fetching city coordinates:', error);
      }
    };
    return (
    <>

        <Header />
<div className='lists' style={imageStyle}>
        <div className='searchBar'>
          <input type='text' placeholder='City, Address or MLS Number'></input>
          <select id="choose-topic" name="transaction" placeholder='Transaction Type'>
          <option value="" disabled selected>Select Transaction Type</option>
          <option value="">Any</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
          <option value="Sold">Sold</option>
          </select>
          <input type='number' placeholder='Minimum Price'></input>
          <input type='number' placeholder='Maximum Price'></input>
          <select id="choose-beds" name="beds" placeholder='Beds'>
          <option value="" disabled selected>Beds</option>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="1+">1+</option>
          <option value="2">2</option>
          <option value="2+">2+</option>
          <option value="3">3</option>
          <option value="3+">3+</option>
          <option value="4">4</option>
          <option value="4+">4+</option>
          <option value="5">5</option>
          <option value="5+">5+</option>
          </select>
          <select id="choose-beds" name="baths" placeholder='Baths'>
          <option value="" disabled selected>Baths</option>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="1+">1+</option>
          <option value="2">2</option>
          <option value="2+">2+</option>
          <option value="3">3</option>
          <option value="3+">3+</option>
          <option value="4">4</option>
          <option value="4+">4+</option>
          <option value="5">5</option>
          <option value="5+">5+</option>
          </select>
          <button>Search</button>
        </div>


</div>
    </>
    );
}

export default Listings;