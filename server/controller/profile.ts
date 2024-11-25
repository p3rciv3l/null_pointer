import express, { Response } from 'express';
import { AddProfileRequest, FakeSOSocket, FindProfileByUsernameRequest, Profile } from '../types';
import { populateProfile, saveProfile } from '../models/application';
import ProfileModel from '../models/profile';

// Initialize the profile controller with a socket for real-time updates
const profileController = (socket: FakeSOSocket) => {
  const router = express.Router();

  // Function to add a new profile
  const addProfile = async (req: AddProfileRequest, res: Response): Promise<void> => {
    console.log('addProfile endpoint hit');
    console.log('Request body:', req.body);

    if (!req.body.username) {
      console.log('Invalid profile: Missing username');
      res.status(400).send('Invalid profile');
      return;
    }

    const profile: Profile = req.body;
    console.log('Received profile:', profile);

    try {
      const result = await saveProfile(profile);
      if ('error' in result) {
        console.log('Error saving profile:', result.error);
        throw new Error(result.error as string);
      }

      console.log('Profile saved:', result);

      const populatedProf = await populateProfile(result._id?.toString());
      if (populatedProf && 'error' in populatedProf) {
        console.log('Error populating profile:', populatedProf.error);
        throw new Error(populatedProf.error as string);
      }

      // Emit a socket event for profile update
      console.log('Emitting profile update event for:', profile);
      socket.emit('profileUpdate', profile as Profile);

      res.json(result);
    } catch (err) {
      console.error('Error when adding profile:', err);
      res.status(500).send(`Error when adding profile: ${(err as Error).message}`);
    }
  };

  // Function to retrieve a profile by username
  const getProfile = async (req: FindProfileByUsernameRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
      const profile = await ProfileModel.findOne({ username }).populate([
        {
          path: 'questionsAsked',
          model: 'Question',
          populate: { path: 'tags', model: 'Tag' },
        },
        {
          path: 'answersGiven',
          model: 'Answer',
          populate: [
            {
              path: 'question',
              model: 'Question',
              select: '_id title askDateTime tags',
              populate: { path: 'tags', model: 'Tag' },
            },
            { path: 'comments', model: 'Comment' },
          ],
        },
      ]);
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      console.error('Error retrieving profile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // Define routes for the profile controller
  router.post('/addProfile', addProfile);
  router.get('/getProfile/:username', getProfile);
  return router;
};

export default profileController;
