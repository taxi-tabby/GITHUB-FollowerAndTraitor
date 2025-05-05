import * as dotenv from 'dotenv';
import { GitHubAPI } from '../src/githubApi';

// Mock the GitHubAPI class
jest.mock('../src/githubApi');
const MockedGitHubAPI = GitHubAPI as jest.MockedClass<typeof GitHubAPI>;

// Mock for readline module
jest.mock('readline', () => {
  return {
    createInterface: jest.fn().mockReturnValue({
      question: jest.fn(),
      close: jest.fn()
    })
  };
});

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('Main Application', () => {
  let originalConsoleLog: any;
  let originalConsoleError: any;
  let mockExit: jest.SpyInstance;
  
  beforeEach(() => {
    // Save original console methods
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Mock process.exit - fixed type definition
    mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
      return undefined as never;
    }) as () => never);
    
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env.GITHUB_TOKEN = 'mock-token';
    process.env.GITHUB_USERNAME = 'test-user';
  });
  
  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    // Restore process.exit
    mockExit.mockRestore();
  });

  it('should initialize the GitHubAPI with token from env', async () => {
    // Import main file (will execute the code)
    jest.isolateModules(() => {
      // This will throw an error since we mocked everything, but we only want to verify initialization
      try {
        require('../src/index');
      } catch (error) {
        // Ignore errors
      }
    });

    // Verify dotenv was configured
    expect(dotenv.config).toHaveBeenCalled();
    
    // Verify GitHubAPI was initialized with the token
    expect(MockedGitHubAPI).toHaveBeenCalledWith('mock-token');
  });

  it('should handle missing GitHub token', async () => {
    // Clear the token
    delete process.env.GITHUB_TOKEN;
    
    // Import main file
    jest.isolateModules(() => {
      try {
        require('../src/index');
      } catch (error) {
        // Ignore errors
      }
    });
    
    // Verify error message was displayed
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('GitHub 토큰이 설정되지 않았습니다')
    );
  });

  it('should handle missing GitHub username', async () => {
    // Clear the username
    delete process.env.GITHUB_USERNAME;
    
    // Import main file
    jest.isolateModules(() => {
      try {
        require('../src/index');
      } catch (error) {
        // Ignore errors
      }
    });
    
    // Verify error message was displayed
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('GitHub 사용자 이름이 설정되지 않았습니다')
    );
  });
});