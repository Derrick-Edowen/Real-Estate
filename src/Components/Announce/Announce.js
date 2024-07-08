import React, { useEffect, useState } from "react";
import './announce.css';

function Announce() {
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        // Get the post data from sessionStorage
        const storedPostData = sessionStorage.getItem("selectedPost");
        if (storedPostData) {
          try {
            const post = JSON.parse(storedPostData);
            setPostData(post);
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
          <h2 className="descTextZ">{postData.title}</h2>
          <img className="annImg" src={postData.image} alt="Post Image" />
          <p className="descTextF">{postData.content}</p>
          <div className="descTextW">[Email Link] | [Phone Number]</div>
          <div className="descTextW">Posted on: {new Date(postData.created_at).toLocaleDateString()}</div>
          </div>
      </div>
    );
  }
  
  export default Announce;