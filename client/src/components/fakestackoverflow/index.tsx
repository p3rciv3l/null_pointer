import { Routes, Route, Navigate } from 'react-router-dom';
import { FakeSOSocket } from '../../types';
import Login from '../login';
import Questions from '../main/questionPage';
import useLoginContext from '../../hooks/useLoginContext';
import UserContext from '../../contexts/UserContext';

interface FakeStackOverflowProps {
  socket: FakeSOSocket | null;
}

const FakeStackOverflow = ({ socket }: FakeStackOverflowProps) => {
  const { currentUser, loading } = useLoginContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='fake-so'>
      <Routes>
        <Route
          path='/'
          element={currentUser ? <Navigate to='/questions' /> : <Navigate to='/login' />}
        />
        <Route path='/login' element={currentUser ? <Navigate to='/questions' /> : <Login />} />
        <Route
          path='/questions/*'
          element={
            currentUser && socket ? (
              <UserContext.Provider value={{ user: currentUser, socket }}>
                <Questions socket={socket} />
              </UserContext.Provider>
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default FakeStackOverflow;
