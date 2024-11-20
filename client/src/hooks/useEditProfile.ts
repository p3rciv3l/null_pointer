import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Profile } from '../types';
import { updateProfile } from '../services/profileService';

/**
 * Custom hook to handle updating the profile.
 *
 * @returns title - the title value of the user's profile.
 * @returns setTitle - function to set the title value of the user's profile.
 * @returns bio - the bio value of the user's profile.
 * @returns setBio - function to set the bio value of the user's profile.
 * @returns updateProfile - function to update the user's profile.
 * @returns titleErr - the error message for the title field.
 * @returns bioErr - the error message for the bio field.
 */
const useEditProfile = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [bio, setBio] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [bioErr, setBioErr] = useState<string>('');
  const [titleErr, setTitleErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the question.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!title) {
      setTitleErr('Title cannot be empty');
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr('Title cannot be more than 100 characters');
      isValid = false;
    } else {
      setTitleErr('');
    }

    if (!bio) {
      setBioErr('Bio text cannot be empty');
      isValid = false;
    } else {
      setBioErr('');
    }

    return isValid;
  };

  /**
   * Function to post a question to the server.
   *
   * @returns title - The current value of the title input.
   */
  const modifyProfile = async () => {
    if (!validateForm()) return;

    // TODO: Update the profile
    const profile = {
      username: user.username,
      title,
      bio,
    } as Profile;
    const res = await updateProfile(profile);

    if (res && res._id) {
      navigate(`/profile/${user.username}`);
    }
  };

  return {
    bio,
    setBio,
    title,
    setTitle,
    modifyProfile,
    bioErr,
    titleErr,
  };
};

export default useEditProfile;
