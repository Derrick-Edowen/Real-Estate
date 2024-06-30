import React, { useState, useEffect } from 'react';
import './Access.css';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBurst } from '@fortawesome/free-solid-svg-icons';
import noImg from '../../Assets/Images/noimg.jpg'



function Access() {
    const location = useLocation();
    const currentUserID = location.state?.currentUserID || '';
    const isLoggedIn = location.state?.isLoggedIn || false;
    const port = process.env.PORT || 3001;

    const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [banner, setBanner] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [newBanner, setNewBanner] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBio, setNewBio] = useState('');

  const fetchBanner = async () => {
    try {
      const response = await fetch('/banner');
      const data = await response.json();
      setBanner(data[0]?.banner || '');
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await fetch('/message');
      const data = await response.json();
      setMessage(data[0]?.message || '');
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const fetchEmail = async () => {
    try {
      const response = await fetch('/email');
      const data = await response.json();
      setEmail(data[0]?.email || '');
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  const fetchPhone = async () => {
    try {
      const response = await fetch('/phone');
      const data = await response.json();
      setPhone(data[0]?.phone || '');
    } catch (error) {
      console.error('Error fetching phone:', error);
    }
  };
  const fetchBio = async () => {
    try {
      const response = await fetch('/bio');
      const data = await response.json();
      setBio(data[0]?.bio || '');
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const response = await fetch('/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: newBio })
      });
      if (response.ok) {
        fetchBio();
        setNewBio('');
      } else {
        console.error('Failed to update bio');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };
  const handleUpdateBanner = async () => {
    try {
      const response = await fetch('/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner: newBanner })
      });
      if (response.ok) {
        fetchBanner();
        setNewBanner('');
      } else {
        console.error('Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };
  
  const handleUpdateMessage = async () => {
    try {
      const response = await fetch('/message', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });
      if (response.ok) {
        fetchMessage();
        setNewMessage('');
      } else {
        console.error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };
  
  const handleUpdateEmail = async () => {
    try {
      const response = await fetch('/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });
      if (response.ok) {
        fetchEmail();
        setNewEmail('');
      } else {
        console.error('Failed to update email');
      }
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };
  
  const handleUpdatePhone = async () => {
    try {
      const response = await fetch('/phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone })
      });
      if (response.ok) {
        fetchPhone();
        setNewPhone('');
      } else {
        console.error('Failed to update phone');
      }
    } catch (error) {
      console.error('Error updating phone:', error);
    }
  };


  useEffect(() => {
    fetchPosts();
    fetchBanner();
    fetchMessage();
    fetchEmail();
    fetchPhone();
    fetchBio();
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

  const handleClick = (index) => {
    const reversedIndex = posts.length - 1 - index;
    setSelectedPost(posts[reversedIndex]);
  };

  const handleClose = () => {
    setSelectedPost(null);
  };
  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };
    return (
        <div className='access'>

<div className='Info-container'>
      <div>Update Banner Statement</div>
      <div>Current Banner Statement - {banner}</div>
      <input
        type='text'
        value={newBanner}
        onChange={(e) => setNewBanner(e.target.value)}
        placeholder='New Banner Statement'
      />
      <button onClick={handleUpdateBanner}>Update Banner</button>

      <div>Update Your Message</div>
      <div>Current Message - {message}</div>
      <input
        type='text'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder='New Message'
      />
      <button onClick={handleUpdateMessage}>Update Message</button>

      <div>Update Contact Information</div>
      <div>Current Email Address - {email}</div>
      <input
        type='email'
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder='New Email Address'
      />
      <button onClick={handleUpdateEmail}>Update Email</button>

      <div>Your Phone Number</div>
      <div>Current Phone Number - {phone}</div>
      <input
        type='tel'
        value={newPhone}
        onChange={(e) => setNewPhone(e.target.value)}
        placeholder='New Phone Number'
      />
      <button onClick={handleUpdatePhone}>Update Phone Number</button>
    </div>
<div className='biog'>
<div>Your Bio/Resume</div>
      <div>Current Bio</div>
        <div>{bio}</div>
      <input
        type='text'
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        placeholder='New Bio'
      />
      <button onClick={handleUpdateBio}>Update Bio</button>

</div>
<div className="blog-containera" id='announcement'>
      <div className="posts-containera">
        {posts.slice().reverse().map((post, index) => (
          <div key={index} className="posta" onClick={() => handleClick(index)}>
            <img className="windowsa" src={post.image || noImg} alt="Post Image" />
            {isNewPost(post.created_at) && (
              <div className='burstera'>
                <FontAwesomeIcon icon={faBurst} style={{color: "#8f0a00",}} />
                <div className='updatera'>New</div>
              </div>
            )}
            <div className="finalssa">
              <div className="blogHeada">{post.title}</div>
              <div className="blogConta">{post.content}</div>
              <button onClick={() => handleClick(index)} className="moorea">
                LEARN MORE
              </button>
              <div className="timera">Posted on: {formatCreatedAt(post.created_at)}</div>
            </div>
            {isLoggedIn && (
              <button className="delbutta" onClick={() => handleDelete(post.id)}>
                Delete this post?
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedPost && !isLoggedIn && (
        <div className="lightboxBa" onClick={handleClose}>
          <div className="lightbox-contentBa" onClick={(e) => e.stopPropagation()}>
            <div className="chassera" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} size="2xl" />
            </div>
            <h3 className="blogHead1a">{selectedPost.title}</h3>
            <img className="windows1a" src={selectedPost.image || noImg} alt="Posted Image Expanded" />
            <div className="blogContla">{selectedPost.content}</div>
            <div className="timer1a">Posted on: {formatCreatedAt(selectedPost.created_at)}</div>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="text-area-containera">
          <input
            type="text"
            className="text-titlea"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter announcement title"
            required
          />
          <textarea
            className="text-areaa"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Enter your announcement content here..."
            rows={5}
            cols={50}
            required
          />
          <input
            type="file"
            className="select-inputa"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={(e) => handleImageChange(e)}
            required
          />

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Image"
              style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '4px', marginLeft: 'auto', marginRight: 'auto' }}
            />
          )}

          <button className="postbutta" onClick={handlePost}>
            Create Post
          </button>
        </div>
      )}
    </div>
</div>
    )
}
export default Access;