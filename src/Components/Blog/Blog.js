import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLocation } from 'react-router-dom';
import sample1 from  '../../Assets/Images/living1.jpg'
import sample2 from  '../../Assets/Images/kitchen1.jpg'
import sample3 from  '../../Assets/Images/backyard1.jpg'
import sample4 from  '../../Assets/Images/yard1.jpg'

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [newType, setNewType] = useState('');

  const location = useLocation();
  const currentUserID = location.state?.currentUserID || '';
  const isLoggedIn = location.state?.isLoggedIn || false;
const port =  process.env.PORT || 3001;
  useEffect(() => {
    fetchPosts();
  }, []);

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
    if (newTitle.trim() !== '' && newContent.trim() !== '') {
      try {
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().slice(0, 10);
        
        const response = await fetch(`/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newTitle,
            content: newContent,
            user_id: 1, // Assuming user_id = 1 for user 1
            created_at: currentDate,
            type: newType
          })
        });
        const data = await response.json();
        setNewTitle('');
        setNewContent('');
        // Fetch posts again to update the posts list with the new post
        fetchPosts();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };
  
  const handleDelete = async (postId) => {
    try {
      await fetch(`/posts/${postId}`, {
        method: 'DELETE'
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
      day: 'numeric'
    });
  }
  
  function formatCreatedAt(dateString) {
    return `(${formatDate(dateString)})`;
  }
  
    const handleClick = (index) => {
      setSelectedPost(posts[index]);
    };
  
    const handleClose = () => {
      setSelectedPost(null);
    };
  return (
    <div className="blog-container">
    <div className="posts-container">
    {posts.map((post, index) => (
  <div key={index} className="post">
    {newType && (
    <img className='windows'
      src={
        newType === "Open House"
          ? {sample1}
          : newType === "Home for Sale"
          ? {sample2}
          : newType === "Looking for Clients"
          ? {sample3}
          : newType === "Home Evaluations"
          ? {sample4}
          : {sample1}
      }
      alt={newType}
    />
  )}
  <div>{post.type}</div>
    <h3 className='blogHead'>{post.title}</h3>
    <div className='timer'>{formatCreatedAt(post.created_at)}</div>
    {isLoggedIn && (
    <button className='delbutt' onClick={() => handleDelete(post.id)}>Delete</button>
    )}
  </div>
))}
    </div>
    {selectedPost && (
        <div className="lightbox" onClick={handleClose}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <h3 className='blogHead'>{selectedPost.title}</h3>
            <p className='blogCont'>{selectedPost.content}</p>
            <div className='timer'>Posted on: {formatCreatedAt(selectedPost.created_at)}</div>
          </div>
        </div>
      )}


    {/* Delete later - Temp to help  CSS- start*/}
    <div className="posts-container">
  <div className="post">
    <h3 className='blogHead'>Header rsbsrbrbhsrbsrbsrbsr</h3>
    <p className='blogCont'>content EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerevzdgveghsrhfrhntyjtjntdyujm
    tntdnbstbrbsfbsfbsfbszfdbsafrgbhasrbsfbasrbsbsfbsbnsfbsb sfbsfbsfbsbfzb</p>
    <div className='timer'>Posted on: 2024-03-25T00:00:00.000Z</div>

  </div>
  <div className="post">
    <h3 className='blogHead'>Header rsbsrbrbhsrbsrbsrbsr</h3>
    <p className='blogCont'>ekjnjveongioe4vjnmeaoivnqerovnmqevkqolekvmqlekvmqevecontent EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerevzdgveghsrhfrhntyjtjntdyujm
    tntdnbstbrbsfbsfbsfbszfdbsafrgbhasrbsfbasrbsbsfbsbnsfbsb sfbsfbsfbsbfzbekjnjveongioe4vjnmeaoivnqerovnmqevkqolekvmqlekvmqevecontent EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerev
    ekjnjveongioe4vjnmeaoivnqerovnmqevkqolekvmqlekvmqevecontent EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerev
    ekjnjveongioe4vjnmeaoivnqerovnmqevkqolekvmqlekvmqevecontent EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerev</p>
    <div className='timer'>Posted on: 2024-03-25T00:00:00.000Z</div>

  </div>
  <div className="post">
    <h3 className='blogHead'>Header rsbsrbrbhsrbsrbsrbsr</h3>
    <p className='blogCont'>content EGRFGERGASRGEARSGGERGDFrewgerge3rgqaergaegaegearqrgaedgaergaegedgbhgbjtjkykykjtjywshsgzdfgaerevzdgveghsrhfrhntyjtjntdyujm
    tntdnbstbrbsfbsfbsfbszfdbsafrgbhasrbsfbasrbsbsfbsbnsfbsb sfbsfbsfbsbfzb</p>
    <div className='timer'>Posted on: 2024-03-25T00:00:00.000Z</div>

  </div>

  
    </div>
    {/* Temp to help - end*/}









    {isLoggedIn && (
      <div className="text-area-container">
        <input
          type="text"
          className="text-title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter announcement title"
        />
        <textarea
          className="text-area"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter your announcement content here..."
          rows={5}
          cols={50}
        />
        <select
      className="select-input"
      value={newType}
      onChange={(e) => setNewType(e.target.value)}
    >
      <option value="Open House">Open House</option>
      <option value="Home for Sale">Home for Sale</option>
      <option value="Looking for Clients">Looking for Clients</option>
      <option value="Home Evaluations">Home Evaluations</option>
      <option value="General">General</option>
    </select>
    {newType === "Open House" && (
      <img src={sample1} alt="Open House" />
    )}
    {newType === "Home for Sale" && (
      <img src={sample2} alt="Home for Sale" />
    )}
    {newType === "Looking for Clients" && (
      <img src={sample3} alt="Looking for Clients" />
    )}
    {newType === "Home Evaluations" && (
      <img src={sample4} alt="Home Evaluations" />
    )}
    {newType === "General" && (
      <img src={sample1} alt="General" />
    )}
    <br />
        
        <button className='postbutt' onClick={handlePost}>Post</button>
      </div>
    )}
  </div>
  );
}

export default Blog;






