import { useEffect, useState } from 'react';
import axios from 'axios';
import { Notification } from '../types';

const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      setLoading(true);
      console.log('Attempting to fetch notifications for user ID:', userId);
      try {
        const response = await axios.get(`/api/notifications/${encodeURIComponent(userId)}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Notifications response:', response.data);
        if (response.data) {
          setNotifications(response.data);
          setError(null);
        }
      } catch (fetchError: any) {
        console.error('Error fetching notifications:', fetchError);
        setError(
          fetchError.response?.data?.message ||
            'Error fetching notifications. Please try again later.',
        );
        setNotifications([]); // Clear notifications on error
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
      // Set up polling for notifications
      const pollInterval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

      // Cleanup
      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [userId]);

  return { notifications, error, loading };
};

export default useNotifications;
