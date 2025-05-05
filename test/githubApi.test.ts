import axios from 'axios';
import { GitHubAPI } from '../src/githubApi';

// Mock axios to avoid making real API calls during tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHubAPI', () => {
  let githubApi: GitHubAPI;
  const mockToken = 'mock-token-123';
  const mockUsername = 'test-user';
  
  // Sample mock data
  const mockFollowers = [
    { login: 'user1', id: 1 },
    { login: 'user2', id: 2 },
    { login: 'user3', id: 3 }
  ];
  
  const mockFollowing = [
    { login: 'user2', id: 2 },
    { login: 'user4', id: 4 }
  ];

  beforeEach(() => {
    // Create a new instance of GitHubAPI before each test
    githubApi = new GitHubAPI(mockToken);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getFollowers', () => {
    it('should fetch followers successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({ data: mockFollowers });

      // Call the method
      const result = await githubApi.getFollowers(mockUsername);

      // Verify the result
      expect(result).toEqual(mockFollowers);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/users/${mockUsername}/followers`),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `token ${mockToken}`
          })
        })
      );
    });

    it('should handle errors and return empty array', async () => {
      // Setup mock response for error case
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
      
      // Mock console.error to prevent error messages during test
      console.error = jest.fn();

      // Call the method
      const result = await githubApi.getFollowers(mockUsername);

      // Verify the result
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getFollowing', () => {
    it('should fetch following users successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({ data: mockFollowing });

      // Call the method
      const result = await githubApi.getFollowing(mockUsername);

      // Verify the result
      expect(result).toEqual(mockFollowing);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/users/${mockUsername}/following`),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `token ${mockToken}`
          })
        })
      );
    });

    it('should handle errors and return empty array', async () => {
      // Setup mock response for error case
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
      
      // Mock console.error to prevent error messages during test
      console.error = jest.fn();

      // Call the method
      const result = await githubApi.getFollowing(mockUsername);

      // Verify the result
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('followUser', () => {
    it('should successfully follow a user', async () => {
      // Setup mock response for a successful follow (204 No Content)
      mockedAxios.put.mockResolvedValueOnce({ status: 204 });
      
      // Mock console.log to check for success message
      console.log = jest.fn();

      // Call the method
      const result = await githubApi.followUser('targetUser');

      // Verify the result
      expect(result).toBe(true);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/user/following/targetUser`),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `token ${mockToken}`
          })
        })
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('성공적으로 팔로우했습니다'));
    });

    it('should handle errors when following a user', async () => {
      // Setup mock response for error case
      mockedAxios.put.mockRejectedValueOnce(new Error('API error'));
      
      // Mock console.error to check for error message
      console.error = jest.fn();

      // Call the method
      const result = await githubApi.followUser('targetUser');

      // Verify the result
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('unfollowUser', () => {
    it('should successfully unfollow a user', async () => {
      // Setup mock response for a successful unfollow (204 No Content)
      mockedAxios.delete.mockResolvedValueOnce({ status: 204 });
      
      // Mock console.log to check for success message
      console.log = jest.fn();

      // Call the method
      const result = await githubApi.unfollowUser('targetUser');

      // Verify the result
      expect(result).toBe(true);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/user/following/targetUser`),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `token ${mockToken}`
          })
        })
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('성공적으로 언팔로우했습니다'));
    });

    it('should handle errors when unfollowing a user', async () => {
      // Setup mock response for error case
      mockedAxios.delete.mockRejectedValueOnce(new Error('API error'));
      
      // Mock console.error to check for error message
      console.error = jest.fn();

      // Call the method
      const result = await githubApi.unfollowUser('targetUser');

      // Verify the result
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('findNonFollowingBack', () => {
    it('should find users who I do not follow back', async () => {
      // Setup spies for the methods this one depends on
      jest.spyOn(githubApi, 'getFollowers').mockResolvedValueOnce(mockFollowers);
      jest.spyOn(githubApi, 'getFollowing').mockResolvedValueOnce(mockFollowing);

      // Call the method
      const result = await githubApi.findNonFollowingBack(mockUsername);

      // Verify the result
      // Should return users who follow me but I don't follow back (user1, user3)
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ login: 'user1' }),
        expect.objectContaining({ login: 'user3' })
      ]));
      expect(githubApi.getFollowers).toHaveBeenCalledWith(mockUsername);
      expect(githubApi.getFollowing).toHaveBeenCalledWith(mockUsername);
    });
  });

  describe('findNotFollowingYou', () => {
    it('should find users who do not follow me back', async () => {
      // Setup spies for the methods this one depends on
      jest.spyOn(githubApi, 'getFollowers').mockResolvedValueOnce(mockFollowers);
      jest.spyOn(githubApi, 'getFollowing').mockResolvedValueOnce(mockFollowing);

      // Call the method
      const result = await githubApi.findNotFollowingYou(mockUsername);

      // Verify the result
      // Should return users who I follow but don't follow me back (user4)
      expect(result).toHaveLength(1);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ login: 'user4' })
      ]));
      expect(githubApi.getFollowers).toHaveBeenCalledWith(mockUsername);
      expect(githubApi.getFollowing).toHaveBeenCalledWith(mockUsername);
    });
  });

  describe('followAllNonFollowingBack', () => {
    it('should follow all users who I do not follow back', async () => {
      // Setup mock data - two users who follow me but I don't follow back
      const nonFollowingBack = [
        { login: 'user1', id: 1 },
        { login: 'user3', id: 3 }
      ];
      
      // Setup spies
      jest.spyOn(githubApi, 'findNonFollowingBack').mockResolvedValueOnce(nonFollowingBack);
      jest.spyOn(githubApi, 'followUser')
        .mockResolvedValueOnce(true) // First user succeeds
        .mockResolvedValueOnce(false); // Second user fails
      
      // Mock setTimeout to avoid waiting in tests
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return {} as any;
      });
      
      // Mock console.log
      console.log = jest.fn();

      // Call the method
      const result = await githubApi.followAllNonFollowingBack(mockUsername);

      // Verify the result
      expect(result).toHaveLength(1); // Only one user was successfully followed
      expect(result).toEqual([{ login: 'user1', id: 1 }]);
      expect(githubApi.findNonFollowingBack).toHaveBeenCalledWith(mockUsername);
      expect(githubApi.followUser).toHaveBeenCalledTimes(2);
      expect(githubApi.followUser).toHaveBeenCalledWith('user1');
      expect(githubApi.followUser).toHaveBeenCalledWith('user3');
    });
  });

  describe('unfollowAllNotFollowingYou', () => {
    it('should unfollow all users who do not follow me back', async () => {
      // Setup mock data - one user who I follow but doesn't follow me back
      const notFollowingYou = [
        { login: 'user4', id: 4 }
      ];
      
      // Setup spies
      jest.spyOn(githubApi, 'findNotFollowingYou').mockResolvedValueOnce(notFollowingYou);
      jest.spyOn(githubApi, 'unfollowUser').mockResolvedValueOnce(true);
      
      // Mock setTimeout to avoid waiting in tests
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return {} as any;
      });
      
      // Mock console.log
      console.log = jest.fn();

      // Call the method
      const result = await githubApi.unfollowAllNotFollowingYou(mockUsername);

      // Verify the result
      expect(result).toHaveLength(1);
      expect(result).toEqual([{ login: 'user4', id: 4 }]);
      expect(githubApi.findNotFollowingYou).toHaveBeenCalledWith(mockUsername);
      expect(githubApi.unfollowUser).toHaveBeenCalledTimes(1);
      expect(githubApi.unfollowUser).toHaveBeenCalledWith('user4');
    });
  });
});