import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Notification } from '../types';

interface ErrorResponse {
  message: string;
}

const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async (): Promise<void> => {
      if (!userId) {
        setNotifications([]);
        return;
      }

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
      } catch (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        const axiosError = fetchError as AxiosError<ErrorResponse>;
        setError(
          axiosError.response?.data?.message ||
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

    return () => {}; // Return empty cleanup function when no userId
  }, [userId]);

  return { notifications, error, loading };
};

export default useNotifications;
