import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import placeHolder  from '../../Assets/Images/rahlogo-placeholder.png'
import './Index.css'


function Footer() {
    const [navActive, setNavActive] = useState(false);
  
    const toggleNav = () => {
      setNavActive(!navActive);
    };
  
    const closeMenu = () => {
      setNavActive(false);
    };
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 500) {
          closeMenu();
        }
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  
    useEffect(() => {
      if (window.innerWidth <= 1200) {
        closeMenu();
      }
    }, []);
  
    return (
      <nav className={`navbar ${navActive ? "active" : ""}`}>
        <a
          className={`nav__hamburger ${navActive ? "active" : ""}`}
          onClick={toggleNav}
        >
          <span className="nav__hamburger__line"></span>
          <span className="nav__hamburger__line"></span>
          <span className="nav__hamburger__line"></span>
        </a>
        <div className={`navbar--items ${navActive ? "active" : ""}`}>
          <div>
          <p>John Smith</p>
          <p>Real Estate Sales Representive</p>
          </div>
          <ul>
            <li>
              <Link
                onClick={closeMenu}
                activeClass="navbar--active-content"
                to="/Home"
                className="navbar--content"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                activeClass="navbar--active-content"
                to="/Listings"
                className="navbar--content"
              >
                Listings
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                activeClass="navbar--active-content"
                to="/About"
                className="navbar--content"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                activeClass="navbar--active-content"
                to="/Contact"
                className="navbar--content"
              >
                Contact
              </Link>
            </li>
          </ul>
          <div>
          <img className="holderImg" src={placeHolder} alt="Placeholder Logo" />
          </div>
        </div>
      </nav>
    );
  }
  
  export default Footer;