import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLocation } from 'react-router-dom';
import sample1 from  '../../Assets/Images/living1.jpg'
import sample2 from  '../../Assets/Images/kitchen1.jpg'
import sample3 from  '../../Assets/Images/backyard1.jpg'
import sample4 from  '../../Assets/Images/yard1.jpg'
import { DateTime } from 'luxon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [newType, setNewType] = useState('');
  const [image, setImage] = useState(null);

  const location = useLocation();
  const currentUserID = location.state?.currentUserID || '';
  const isLoggedIn = location.state?.isLoggedIn || false;
const port =  process.env.PORT || 3001;

  useEffect(() => {
    fetchPosts();
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
    if (newTitle.trim() !== '' && newContent.trim() !== '') {
      try {
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('content', newContent);
        formData.append('user_id', 1); // Assuming user_id = 1 for user 1
        const easternDateTime = DateTime.now().setZone('America/New_York');
        const formattedDateTime = easternDateTime.toISODate(); // Format as YYYY-MM-DD
        formData.append('created_at', formattedDateTime);
        formData.append('image', image);
  
        const response = await fetch(`/posts`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        setNewTitle('');
        setNewContent('');
        setImage(null);
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
    return `${formatDate(dateString)}`;
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
  <div key={index} className="post" onClick={() => handleClick(index)}>
      <img
      src={post.image}
      alt="Post Image"
      />
    <div className='finalss'>
    <h3 className='blogHead'>{post.title}</h3>
    <p className='blogCont'>{post.content}</p>
    </div>
    <div className='moore'>Click to Learn More!</div>
    <div className='timer'>Posted on: {formatCreatedAt(post.created_at)}</div>
    {isLoggedIn && (
    <button className='delbutt' onClick={() => handleDelete(post.id)}>Delete this post?</button>
    )}
  </div>
))}
    </div>
    {selectedPost && !isLoggedIn && (
  <div className="lightboxB" onClick={handleClose}>
    <div className="lightbox-contentB" onClick={(e) => e.stopPropagation()}>
    <div className="chasser" onClick={handleClose}>
    <FontAwesomeIcon icon={faXmark} size='2xl'/>
          </div>
      <h3 className='blogHead'>{selectedPost.title}</h3>
  <img
  className='windows'
  src={
    selectedPost.image}
/>
      <p className='blogContl'>{selectedPost.content}</p>
      <div className='timer1'>Posted on: {formatCreatedAt(selectedPost.created_at)}</div>
    </div>
  </div>
)}


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
     <input
  type="file"
  className="select-input"
  onChange={(e) => handleImageChange(e)}
/>

    
        <button className='postbutt' onClick={handlePost}>Create Post</button>
      </div>
    )}
  </div>
  );
}

export default Blog;






