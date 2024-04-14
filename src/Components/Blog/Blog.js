import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLocation } from 'react-router-dom';
import sample1 from  '../../Assets/Images/living1.jpg'
import sample2 from  '../../Assets/Images/kitchen1.jpg'
import sample3 from  '../../Assets/Images/backyard1.jpg'
import sample4 from  '../../Assets/Images/yard1.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
  const content = [" Kinda got a headache ngl fam.THIS IS JUST A TEST OF THE CONTENT SO  i KNOW HOW IT WILL LOOK AND FEEL. Kinda got a headache ngl fam."]
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
    {post.type && (
    <img
      className='windows'
      src={
        post.type === "Open House" ? sample1 :
                post.type === "Home for Sale" ? sample2 :
                post.type === "Looking for Clients" ? sample3 :
                post.type === "Home Evaluations" ? sample4 :
                sample1
      }
      alt={post.type}
    />
  )}
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
    {selectedPost && (
  <div className="lightboxB" onClick={handleClose}>
    <div className="lightbox-contentB" onClick={(e) => e.stopPropagation()}>
    <div className="chasser" onClick={handleClose}>
    <FontAwesomeIcon icon={faXmark} size='2xl'/>
          </div>
      <h3 className='blogHead'>{selectedPost.title}</h3>
      {selectedPost.type && (
    <img
      className='windows'
      src={
        selectedPost.type === "Open House" ? sample1 :
        selectedPost.type === "Home for Sale" ? sample2 :
        selectedPost.type === "Looking for Clients" ? sample3 :
        selectedPost.type === "Home Evaluations" ? sample4 :
                sample1
      }
      alt={selectedPost.type}
    />
  )}
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
        <select
      className="select-input"
      value={newType}
      onChange={(e) => setNewType(e.target.value)}
    >
      <option value="" disabled selected>Select an Image</option>
      <option value="Open House">Open House</option>
      <option value="Home for Sale">Home for Sale</option>
      <option value="Looking for Clients">Looking for Clients</option>
      <option value="Home Evaluations">Home Evaluations</option>
      <option value="General">General</option>
    </select>
    {newType === "Open House" && (
      <img className='windows1' src={sample1} alt="Open House" />
    )}
    {newType === "Home for Sale" && (
      <img className='windows1' src={sample2} alt="Home for Sale" />
    )}
    {newType === "Looking for Clients" && (
      <img className='windows1' src={sample3} alt="Looking for Clients" />
    )}
    {newType === "Home Evaluations" && (
      <img className='windows1' src={sample4} alt="Home Evaluations" />
    )}
    {newType === "General" && (
      <img className='windows1' src={sample1} alt="General" />
    )}

    <br />
        
        <button className='postbutt' onClick={handlePost}>Create Post</button>
      </div>
    )}
  </div>
  );
}

export default Blog;






