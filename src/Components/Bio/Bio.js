import React, { useState, useEffect } from 'react';
import './bio.css';



function Bio() {
    const [bio, setBio] = useState('');

    useEffect(() => {
        fetchBio();
      }, []);
      
const fetchBio = async () => {
    try {
      const response = await fetch('/bio');
      const data = await response.json();
      setBio(data[0]?.bio || '');
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };
    return (
        <>
<div className="bio">Bio Page
<div>Current Bio</div>
        <div>{bio}</div>
        </div>
        </>
    )
}
export default Bio;