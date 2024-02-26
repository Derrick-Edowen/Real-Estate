import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLocation } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const location = useLocation();
  const currentUserID = location.state?.currentUserID || '';
  const isLoggedIn = location.state?.isLoggedIn || false;


  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (newTitle.trim() !== '' && newContent.trim() !== '') {
      try {
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().slice(0, 10);
        
        const response = await fetch('http://localhost:5000/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newTitle,
            content: newContent,
            user_id: 1, // Assuming user_id = 1 for user 1
            created_at: currentDate
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
      await fetch(`http://localhost:5000/posts/${postId}`, {
        method: 'DELETE'
      });
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  
  

  return (
    <div className="blog-container">
    <div className="posts-container">
    {posts.map((post, index) => (
  <div key={index} className="post">
    <h3 className='blogHead'>{post.title}</h3>
    <p className='blogCont'>{post.content}</p>
    {isLoggedIn && (
    <button onClick={() => handleDelete(post.id)}>Delete</button>
    )}
  </div>
))}

    </div>
    {isLoggedIn && (
      <div className="text-area-container">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter post title"
        />
        <textarea
          className="text-area"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter your post content here..."
          rows={5}
          cols={50}
        />
        <br />
        <button onClick={handlePost}>Post</button>
      </div>
    )}
  </div>
  );
}

export default Blog;






