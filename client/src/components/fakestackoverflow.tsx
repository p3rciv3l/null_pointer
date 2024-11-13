import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login/index';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import ProfilePage from './main/profile/profilePage';
import EditProfilePage from './main/profile/profileEditPage';
import useLogin from '../hooks/useLogin';
import SignUp from './signup/index';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const { currentUser } = useLogin();
  console.log('FakeStackOverflow rendering, currentUser:', currentUser);

  const login = () => (
    <Routes>
      {/* Public Routes */}
      <Route
        path='/'
        element={(() => {
          console.log('Rendering root route, currentUser:', currentUser);
          return !currentUser ? <Login /> : <Navigate to='/home' />;
        })()}
      />
      <Route path='/signup' element={!currentUser ? <SignUp /> : <Navigate to='/home' />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute user={currentUser} socket={socket}>
            <Layout />
          </ProtectedRoute>
        }>
        <Route path='/home' element={<QuestionPage />} />
        <Route path='tags' element={<TagPage />} />
        <Route path='/question/:qid' element={<AnswerPage />} />
        <Route path='/new/question' element={<NewQuestionPage />} />
        <Route path='/update/profile' element={<EditProfilePage />} />
        <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Route>
    </Routes>
  );

  return login();
};

export default FakeStackOverflow;
