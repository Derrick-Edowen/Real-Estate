import React, { useEffect, useState } from "react";
import './announce.css';
import Contact from '../Contact/Contact';

function Announce() {
    const [postData, setPostData] = useState(null);
   useEffect(() => {
      // Ensure adsbygoogle script is loaded
      const adsbygoogleScript = document.createElement('script');
      adsbygoogleScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      adsbygoogleScript.async = true;
      adsbygoogleScript.crossOrigin = 'anonymous';
      document.head.appendChild(adsbygoogleScript);

      // Push the ads once the script is loaded
      adsbygoogleScript.onload = () => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
      };
  }, []);
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
  
    return (<>
<aside className="leftSidebar">
<ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="2071134414"></ins>
            </aside>
      <main className="bentley">
        <div className="post-details">
          <h2 className="descTextZ">{postData.title}</h2>
          <img className="annImg" src={postData.image} alt="Post Image" />
          <p className="descTextF">{postData.content}</p>
          <div className="descTextW">[Email Link] | [Phone Number]</div>
          <div className="descTextW">Posted on: {new Date(postData.created_at).toLocaleDateString()}</div>
          <div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="3483717615"></ins>
                </div>
          </div>
      </main>
      <aside className="rightSidebar">
      <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="7895989687"></ins>
            </aside>
                <Contact />

    </>);
  }
  
  export default Announce;