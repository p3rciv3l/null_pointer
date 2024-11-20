import express, { Response } from 'express';
import { AddProfileRequest, FakeSOSocket, FindProfileByUsernameRequest, Profile } from '../types';
import { populateProfile, saveProfile } from '../models/application';
import ProfileModel from '../models/profile';

const profileController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Adds a new profile to the database. The profile request and profile are
   * validated and then saved. If successful, the profile is created. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AddProfileRequest object containing the profile data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
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

      const populatedProf = await populateProfile(profile._id?.toString());

      if (populatedProf && 'error' in populatedProf) {
        throw new Error(populatedProf.error as string);
      }

      // Populates the fields of the profile that were added and emits the new object
      socket.emit('profileUpdate', profile as Profile);
      res.json(result);
    } catch (err) {
      res.status(500).send(`Error when adding profile: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a profile by its unique username,
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindProfileByUsernameRequest object containing the username as a parameter.
   * @param res The HTTP response object used to send back the profile details.
   *
   * @returns A Promise that resolves to void.
   */
  const getProfile = async (req: FindProfileByUsernameRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
      const profile = await ProfileModel.findOne({ username });
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addProfile', addProfile);
  router.get('/getProfile/:username', getProfile);
  return router;
};

export default profileController;