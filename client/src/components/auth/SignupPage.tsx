import React, { useState } from 'react';
import { addProfile } from '../../services/profileService';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const profile = {
        username,
        email,
        password,
        title: '',
        bio: '',
        answersGiven: [],
        questionsAsked: [],
        questionsUpvoted: [],
        answersUpvoted: [],
        joinedWhen: new Date(),
        following: [],
      };
      await addProfile(profile);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to create profile');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Profile created successfully!</p>}
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupPage;
