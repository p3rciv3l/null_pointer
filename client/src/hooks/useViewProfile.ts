import { useEffect, useState } from 'react';
import { Profile } from '../types';
import { getProfile } from '../services/profileService';

interface UseViewProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

const useViewProfile = (username?: string): UseViewProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      // Reset state for new username fetch
      setProfile(null);
      setLoading(true);
      setError(null);

      try {
        if (username) {
          const data = await getProfile(username);
          console.log('profile data', data);
          setProfile(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  return { profile, loading, error };
};

export default useViewProfile;
