import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import  { Icon } from 'leaflet'
import Header from '../Header/Header';
import './Index.css'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import placeHouse from '../../Assets/Images/placeHouse.jpg'
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'


function Listings() {
  const markers = [{
    geocode: [43.6426,-79.3871]
  }];
  const customIcon = new Icon ({
    iconUrl: require("../../Assets/Images/pin.png"),
    iconSize: [25, 25]
  });
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

    /*const [apiData, setApiData] = useState(null);
  
    useEffect(() => {
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
          console.log('API Data - Hockey:', data);
          setApiData(data); 
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);*/y

    return (
    <>
        <Header />
        <div className='lists' style={imageStyle}>
        <div className='overlay'>


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
        <div className='mapBox'>
          <MapContainer center={[43.6426,-79.3871]} zoom={10.5}>
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {markers.map(marker => (
          <Marker position={marker.geocode} icon={customIcon}>
           </Marker>
          ))
          }
          </MapContainer>
        </div>
        <div className="listings-container">
      <aside className="sidebar">
        <h2>Results: Listings</h2>
        <div className="scrollable-cards">
          {/* Card 1 */}
          <div className="card">
            <img src={placeHouse} alt="1" />
            <p>Text content for Card 1</p>
          </div>
          {/* Card 2 */}
          <div className="card">
            <img src={placeHouse} alt="2" />
            <p>Text content for Card 2</p>
          </div>
          {/* Card 3 */}
          <div className="card">
            <img src={placeHouse} alt="3" />
            <p>Text content for Card 2</p>
          </div>
          {/* Card 4 */}
          <div className="card">
            <img src={placeHouse} alt="4" />
            <p>Text content for Card 2</p>
          </div>
        </div>
      </aside>
    </div>
    </div>
    </div>
    </>
    );
}

export default Listings;