import { useEffect } from 'react';
import io from 'socket.io-client';

const useProfileSocket = (isConnected: boolean) => {
  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (!serverUrl) {
      return undefined;
    }

    const socket = io(serverUrl);

    socket.on('profileUpdate', updatedProfile => {
      // Handle the updated profile data
    });

    return () => {
      socket.disconnect();
    };
  }, [isConnected]);
};

export default useProfileSocket;
