import express, { Response } from 'express';
import { AddProfileRequest, FakeSOSocket, FindProfileByUsernameRequest, Profile } from '../types';
import { calculateTagScores, populateProfile, saveProfile } from '../models/application';
import ProfileModel from '../models/profile';

// Initialize the profile controller with a socket for real-time updates
const profileController = (socket: FakeSOSocket) => {
  const router = express.Router();

  // Function to add a new profile
  const addProfile = async (req: AddProfileRequest, res: Response): Promise<void> => {
    if (!req.body.username) {
      res.status(400).send('Invalid profile');
      return;
    }

    const profile: Profile = req.body;

    try {
      const result = await saveProfile(profile);
      if ('error' in result) {
        throw new Error(result.error as string);
      }

      const populatedProf = await populateProfile(result._id?.toString());
      if (populatedProf && 'error' in populatedProf) {
        throw new Error(populatedProf.error as string);
      }

      socket.emit('profileUpdate', profile as Profile);

      res.json(result);
    } catch (err) {
      res.status(500).send(`Error when adding profile: ${(err as Error).message}`);
    }
  };

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
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      const topTags = await calculateTagScores(profile.questionsAsked);

      res.json({
        id: profile.id,
        username: profile.username,
        title: profile.title,
        bio: profile.bio,
        answersGiven: profile.answersGiven,
        questionsAsked: profile.questionsAsked,
        questionsUpvoted: profile.questionsUpvoted,
        answersUpvoted: profile.answersUpvoted,
        joinedWhen: profile.joinedWhen,
        following: profile.following,
        topTags,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  router.post('/addProfile', addProfile);
  router.get('/getProfile/:username', getProfile);
  return router;
};

export default profileController;
