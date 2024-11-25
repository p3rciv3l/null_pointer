import { useEffect } from 'react';
import io from 'socket.io-client';

const useProfileSocket = () => {
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (!serverUrl) {
      console.error('Server URL is not defined');
      return;
    }

    const socket = io(serverUrl);

    socket.on('profileUpdate', (updatedProfile) => {
      console.log('Profile updated:', updatedProfile);
      // Handle the updated profile data
    });

    // Cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, []);
};

export default useProfileSocket;
