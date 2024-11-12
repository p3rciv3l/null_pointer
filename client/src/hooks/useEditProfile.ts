import { useState } from 'react';

/**
 * Custom hook to access the LoginContext.
 *
 * @throws It will throw an error if the `LoginContext` is null.
 *
 * @returns context - the context value for managing login state, including the `setUser` function.
 */
const useEditProfile = () => {
  const [bioText, setBioText] = useState('');
  const [bioTextErr, setBioTextErr] = useState('');

  const [titleText, setTitleText] = useState('');
  const [titleTextErr, setTitleTextErr] = useState('');

  const updateProfile = () => {
    if (bioText.length === 0) {
      setBioTextErr('Bio is required');
    }

    if (titleText.length === 0) {
      setTitleTextErr('Title is required');
    }

    // Update the user's profile
  };

  return {
    bioText,
    setBioText,
    bioTextErr,
    titleText,
    setTitleText,
    titleTextErr,
    updateProfile,
  };
};

export default useEditProfile;
