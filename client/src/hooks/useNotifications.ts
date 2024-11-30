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
      try {
        const response = await axios.get(`/api/notifications/${encodeURIComponent(userId)}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data) {
          setNotifications(response.data);
          setError(null);
        }
      } catch (fetchError) {
        const axiosError = fetchError as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || '');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
      const pollInterval = setInterval(fetchNotifications, 30000);

      return () => {
        clearInterval(pollInterval);
      };
    }

    return () => {};
  }, [userId]);

  return { notifications, error, loading };
};

export default useNotifications;
