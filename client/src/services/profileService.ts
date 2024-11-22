import { Profile } from '../types';
import api from './config';

const PROFILE_API_URL = `${process.env.REACT_APP_SERVER_URL}/profile`;

/**
 * Function to update a profile.
 *
 * @param p - The profile object to update.
 * @throws Error if there is an issue updating the profile.
 */
const updateProfile = async (p: Profile): Promise<Profile> => {
  const res = await api.post(`${PROFILE_API_URL}/updateProfile`, p);

  if (res.status !== 200) {
    throw new Error('Error while updating a profile');
  }

  return res.data;
};

/**
 * Function to get a profile by its username.
 *
 * @param username - The username of the profile to retrieve.
 * @throws Error if there is an issue fetching the profile by username.
 */
const getProfile = async (username: string): Promise<Profile> => {
  // console.log('Making request to:', `${PROFILE_API_URL}/getProfile/${username}`);
  try {
    const res = await api.get(`${PROFILE_API_URL}/getProfile/${username}`);
    // console.log('Response:', res);
    if (res.status !== 200) {
      throw new Error('Error when fetching profile by username');
    }

    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getProfile:', error);
    throw error;
  }
};

const addProfile = async (p: Profile): Promise<Profile> => {
  const res = await api.post(`${PROFILE_API_URL}/addProfile`, p);

  if (res.status !== 200) {
    throw new Error('Error while creating a new profile');
  }

  return res.data;
};

export { getProfile, updateProfile, addProfile };
