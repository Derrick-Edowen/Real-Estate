import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css"
import logol from '../../Assets/Images/logo.PNG'

function Login() {
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserID, setCurrentUserID] = useState('');

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailAddress(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: emailAddress,
          password: password
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUserID(data.userID);
        navigate('/Agent Access', { state: { isLoggedIn: true, currentUserID: data.userID } });
      } else {
        alert('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='logginCont'>
  <form className="togin formBox-specific" onSubmit={handleSubmit}>
    <div className='logolbox'>
  <img className="logol" src={logol} />
  </div>
    <div className='descTextJl'>Agent Portal Login</div>
    <div className="inputBox-specific">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <label>Name</label>
    </div>
    <div className="inputBox-specific">
      <input
        type="text"
        placeholder="Email"
        value={emailAddress}
        onChange={handleEmailChange}
        required
      />
      <label>Email</label>
    </div>
    <div className="inputBox-specific">
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <label>Password</label>
    </div>
    <input className='loggg' type="submit" value="Login" />
  </form>
</div>


  );
}

export default Login;




