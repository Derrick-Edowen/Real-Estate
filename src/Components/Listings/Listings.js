import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Header from '../Header/Header';
import './Index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
//import placeHouse from '../../Assets/Images/placeHouse.jpg'
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'


function Listings() {
//Images
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
//Mapping
const [position, setPosition] = useState({ lat: 43.6426, lng: -79.3871 });
  const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
const handleSearch = () => {
  const address = document.getElementById('search').value; // Get the value from the input

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  fetch(geocodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const { results } = data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        setPosition({ lat, lng }); // Update the position with the obtained latitude and longitude
      } else {
        window.alert('Location Not Found: Try Using More Descriptive Words!');
      }
    })
    .catch((error) => {
      console.error('There was a problem fetching the data:', error);
    });
};








//API Call
    const [apiData, setApiData] = useState(null);
    const [cardsData, setCardsData] = useState([]);

    /*useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://realtor-canadian-real-estate.p.rapidapi.com/properties/list-residential', {
            params: {
              CurrentPage: '1',
              LatitudeMin: '-22.26872153207163',
              LongitudeMax: '-10.267941690981388',
              RecordsPerPage: '10',
              LongitudeMin: '-136.83037765324116',
              LatitudeMax: '81.14747595814636',
              BedRange: '2-2+',
              BathRange: '2-2+',
              CultureId: '1',
              SortBy: '1',
              SortOrder: 'A',
              RentMin: '0',
              TransactionTypeId: '2'
            },
            headers: {
              'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
              'X-RapidAPI-Host': 'realtor-canadian-real-estate.p.rapidapi.com'
            },
          });
  
          const data = response.data;
          console.log(data);
          setApiData(data); 
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);*/

    return (
    <>
        <Header />
        <div className='lists' style={imageStyle}>
        <div className='overlay'>

        <div className='searchBar'>
          <input id='search' type='text' placeholder='City, Neighbourhood or Address'></input>
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
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className='maps'>
<APIProvider apiKey='AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'>
  <Map center={position} zoom={10}>
    <Marker position={position}/>
  </Map>
</APIProvider>
        </div>
        <div className="card-container">
      {cardsData.map((card, index) => (
        <div className="card" key={index}>
          <img src={card.imageUrl} alt={`Image ${index}`} />
          <p>{card.text}</p>
        </div>
        ))}
        </div>
       
    </div>
    </div>
    </>
    );
}
 
export default Listings;