import express, { Response } from 'express';
import {
  AddProfileRequest,
  FakeSOSocket,
  FindProfileByUsernameRequest,
  Profile,
  updateProfileRequest,
} from '../types';
import {
  calculateBadges,
  calculateReputation,
  calculateTagScores,
  populateProfile,
  saveProfile,
} from '../models/application';
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
        res.status(404).json({ message: 'Profile not found' });
        return;
      }

      const topTags = await calculateTagScores(profile.questionsAsked);
      const badgeCount = await calculateBadges(profile.questionsAsked, profile.answersGiven);
      const reputation = await calculateReputation(profile.questionsAsked, profile.answersGiven);

      res.status(200).json({
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
        badgeCount,
        reputation,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const updateEditProfile = async (req: updateProfileRequest, res: Response): Promise<void> => {
    // Ensure at least one field is being updated
    if (!req.query.title && !req.query.bio) {
      throw new Error('At least one field (title or bio) must be provided.');
    }

    // Construct the update object dynamically
    const updateDocument: Partial<Profile> = {};
    if (req.query.title) updateDocument.title = req.query.title;
    if (req.query.bio) updateDocument.bio = req.query.bio;

    // Simulate updating the database
    const { username } = req.params;
    try {
      const profile = await ProfileModel.findOneAndUpdate(
        { username }, // Filter to find the profile
        { $set: updateDocument }, // Update only the provided fields
        { new: true }, // Return the updated profile
      );
      if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
      }

      const topTags = await calculateTagScores(profile.questionsAsked);
      const badgeCount = await calculateBadges(profile.questionsAsked, profile.answersGiven);
      const reputation = await calculateReputation(profile.questionsAsked, profile.answersGiven);

      res.status(200).json({
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
        badgeCount,
        reputation,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  router.post('/addProfile', addProfile);
  router.get('/getProfile/:username', getProfile);
  router.post('/updateProfile', updateEditProfile);
  return router;
};

export default profileController;
