import test from 'firebase-functions-test';
import { expect } from 'chai';
import * as functions from '../src/index';

// Initialize Firebase Test SDK in offline mode
const testEnv = test();

describe('Firebase Functions', () => {

  after(() => {
    // Clean up
    testEnv.cleanup();
  });

  describe('helloWorld', () => {
    it('should return hello message', (done) => {
      const req = {
        method: 'GET',
        url: '/',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      const res = {
        send: (message: string) => {
          expect(message).to.equal('Hello from Firebase Functions!');
          done();
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      functions.helloWorld(req, res);
    });
  });

  describe('getUserData', () => {
    it('should throw error for unauthenticated user', async () => {
      const mockContext = {
        auth: null,
      };

      const wrapped = testEnv.wrap(functions.getUserData);
      
      try {
        await wrapped({}, mockContext);
        expect.fail('Expected function to throw an error');
      } catch (error: unknown) {
        expect((error as Error).message).to.include('The function must be called while authenticated');
      }
    });
  });

  describe('onUserCreate', () => {
    it('should log when user is created', async () => {
      // Create a mock snapshot using firebase-functions-test
      const mockData = {
        name: 'New User',
        email: 'newuser@example.com',
      };

      const mockSnapshot = testEnv.firestore.makeDocumentSnapshot(
        mockData,
        'users/new-user-id'
      );

      const wrapped = testEnv.wrap(functions.onUserCreate);
      const result = await wrapped(mockSnapshot);

      expect(result).to.be.null;
    });
  });
});