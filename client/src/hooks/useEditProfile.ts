import { useState } from 'react';

/**
 * Custom hook to access the LoginContext.
 *
 * @throws It will throw an error if the `LoginContext` is null.
 *
 * @returns context - the context value for managing login state, including the `setUser` function.
 */
const useEditProfile = () => {
  const [text, setText] = useState('');
  const [textErr, setTextErr] = useState('');

  const updateProfile = () => {
    if (text.length === 0) {
      setTextErr('Bio is required');
    }

    // Update the user's profile
    // ...
  };

  return {
    text,
    setText,
    textErr,
    updateProfile,
  };
};

export default useEditProfile;
