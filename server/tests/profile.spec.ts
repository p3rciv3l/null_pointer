import supertest from 'supertest';
import mongoose, { Query } from 'mongoose';
import { app } from '../app';
import { saveProfile, populateProfile } from '../models/application';
import ProfileModel from '../models/profile';
import { Profile } from '../types';

jest.mock('../models/application');
jest.mock('../models/profile');

const mockSaveProfile = jest.mocked(saveProfile);
const mockPopulateProfile = jest.mocked(populateProfile);
const mockFindOne = jest.spyOn(ProfileModel, 'findOne');

describe('Profile Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /profile/addProfile', () => {
    it('should add a profile successfully and emit an event', async () => {
      const mockProfile = {
        username: 'testUser',
        email: 'test@example.com',
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Title',
        bio: 'Test Bio',
        answersGiven: [],
        questionsAsked: [],
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        questionsUpvoted: [],
        answersUpvoted: [],
        joinedWhen: new Date(),
      };

      mockSaveProfile.mockResolvedValueOnce(mockProfile);
      mockPopulateProfile.mockResolvedValueOnce(mockProfile);

      const response = await supertest(app)
        .post('/profile/addProfile')
        .send({ username: 'testUser', email: 'test@example.com' });

      expect(response.status).toBe(200);
    });

    it('should return a 400 error if username is missing', async () => {
      const response = await supertest(app)
        .post('/profile/addProfile')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid profile');
      expect(mockSaveProfile).not.toHaveBeenCalled();
    });

    it('should return a 500 error if saving profile fails', async () => {
      mockSaveProfile.mockResolvedValueOnce({ error: 'Save failed' });

      const response = await supertest(app)
        .post('/profile/addProfile')
        .send({ username: 'testUser', email: 'test@example.com' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when adding profile: Save failed');
    });

    it('should return a 500 error if populating profile fails', async () => {
      const mockProfile = {
        username: 'testUser',
        email: 'test@example.com',
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Title',
        bio: 'Test Bio',
        answersGiven: [],
        questionsAsked: [],
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        questionsUpvoted: [],
        answersUpvoted: [],
        joinedWhen: new Date(),
      };

      mockSaveProfile.mockResolvedValueOnce(mockProfile);
      mockPopulateProfile.mockResolvedValueOnce({ error: 'Populate failed' });

      const response = await supertest(app)
        .post('/profile/addProfile')
        .send({ username: 'testUser', email: 'test@example.com' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when adding profile: Populate failed');
    });
  });

  describe('GET /profile/getProfile/:username', () => {
    it('should retrieve a profile by username successfully', async () => {
      const mockProfile = {
        username: 'testUser',
        email: 'test@example.com',
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Title',
        bio: 'Test Bio',
        answersGiven: [],
        questionsAsked: [],
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        questionsUpvoted: [],
        answersUpvoted: [],
        joinedWhen: new Date(),
      };

      mockFindOne.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockProfile),
      } as unknown as Query<unknown, unknown, object, Profile, 'findOne', object>);

      const response = await supertest(app).get('/profile/getProfile/testUser');

      expect(response.status).toBe(200);
      expect(mockFindOne).toHaveBeenCalledWith({ username: 'testUser' });
    });

    it('should return a 404 error if profile is not found', async () => {
      mockFindOne.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<unknown, unknown, object, Profile, 'findOne', object>);

      const response = await supertest(app).get('/profile/getProfile/nonExistentUser');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Profile not found' });
    });

    it('should return a 500 error if there is a server error', async () => {
      mockFindOne.mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await supertest(app).get('/profile/getProfile/testUser');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error', error: {} });
    });
  });
});
