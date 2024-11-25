import { useEffect, useState } from 'react';
import axios from 'axios';
import { Notification } from '../types';

const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications?userId=${userId}`);
        setNotifications(response.data);
        setError(null); // Clear any previous errors
      } catch (fetchError) {
        setError('Error fetching notifications. Please try again later.');
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return { notifications, error };
};

export default useNotifications;
