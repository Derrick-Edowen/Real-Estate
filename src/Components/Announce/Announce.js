import React, { useEffect, useState } from "react";
import './announce.css';

function Announce() {
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        // Get the post data from sessionStorage
        const postDataString = sessionStorage.getItem("selectedPost");
        if (postDataString) {
          try {
            const post = JSON.parse(postDataString);
            setPostData(post);
            // Clear sessionStorage after fetching data
            sessionStorage.removeItem("selectedPost");
          } catch (error) {
            console.error('Error parsing post data:', error);
          }
        }
      }, []);
    
      if (!postData) {
        return <div>Loading...</div>;
      }
  
    return (
      <div className="bentley">
        <div className="post-details">
          <h2 className="descTextF">{postData.title}</h2>
          <img src={postData.image} alt="Post Image" />
          <p className="descTextF">{postData.content}</p>
          <div className="descTextF">Posted on: {new Date(postData.created_at).toLocaleDateString()}</div>
          </div>
      </div>
    );
  }
  
  export default Announce;