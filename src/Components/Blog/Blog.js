import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCertificate } from '@fortawesome/free-solid-svg-icons';
import noImg from '../../Assets/Images/noimg.jpg'
import Contact from '../Contact/Contact';

//Add a comment section to the announcements!
function Blog() {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('');


  const location = useLocation();
  const currentUserID = location.state?.currentUserID || '';
  const isLoggedIn = location.state?.isLoggedIn || false;
  const port = process.env.PORT || 3001;

  const handleClick = (index) => {
    const reversedIndex = posts.length - 1 - index;
    const post = posts[reversedIndex];

    // Store post data in sessionStorage
    sessionStorage.setItem("selectedPost", JSON.stringify(post));

    // Open a new tab with the Announce page
    const postUrl = `/Announcements/${encodeURIComponent(post.title)}`;
    window.open(postUrl, '_blank');
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePost = async () => {
    if (newTitle.trim() !== '' && newContent.trim() !== '' && image) {
      try {
        const easternDateTime = DateTime.now().setZone('America/New_York');
        const formattedDateTime = easternDateTime.toISODate(); // Format as YYYY-MM-DD

        const postData = new FormData();
        postData.append('title', newTitle);
        postData.append('content', newContent);
        postData.append('user_id', 1); // Assuming user_id = 1 for user 1
        postData.append('created_at', formattedDateTime);
        postData.append('image', image);

        const response = await fetch(`/posts`, {
          method: 'POST',
          body: postData,
        });

        const data = await response.json();
        setNewTitle('');
        setNewContent('');
        setImage(null);
        setSelectedImage(null);
        fetchPosts();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleDelete = async (postId) => {
    try {
      await fetch(`/posts/${postId}`, {
        method: 'DELETE',
      });
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatCreatedAt(dateString) {
    return `${formatDate(dateString)}`;
  }
  
  const handleClose = () => {
    setSelectedPost(null);
  };
  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  useEffect(() => {
    const initializeAds = () => {
      if (window.adsbygoogle) {
        window.adsbygoogle.loaded = true;
        for (let i = 0; i < 3; i++) {
          window.adsbygoogle.push({});
        }
      }
    };
    
    const timeoutId = setTimeout(initializeAds, 1000); // Push ads 1 second after page load
    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, []);
  return (<>
<aside className="leftSidebar">
<ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="8868347173"></ins>
            </aside>
<main className="blog-container">
<div className="descTextJc">News and Announcements!</div>
<p className="descTexcpml">Stay up to date with my News and Announcement below. Click on my posts to find out more details! </p>

      <div className="posts-container">
        {posts.slice().reverse().map((post, index) => (
          <div key={index} className="post" onClick={() => handleClick(index)}>
            <img className="windows" src={post.image || noImg} alt="Post Image" />
            {isNewPost(post.created_at) && (
              <div className="burster">
                <FontAwesomeIcon icon={faCertificate} style={{ color: '#c01e1e' }} />
                <div className="updater">New</div>
              </div>
            )}
            <div className="finalss">
              <div className="blogHead">{post.title}</div>
              <div className='timer'>Posted: {formatCreatedAt(post.created_at)}</div>
            </div>
          </div>
        ))}
        <div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="1026921148"></ins>
                </div>
      </div>
    </main>
    <aside className="rightSidebar">
      <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '620px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="4966166150"></ins>
            </aside>
    <Contact />
    </>);
}

export default Blog;






