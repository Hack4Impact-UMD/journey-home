import * as admin from 'firebase-admin';
import test from 'firebase-functions-test';
import { expect } from 'chai';
import * as sinon from 'sinon';

// Initialize Firebase Test SDK in offline mode
const testEnv = test();

// Mock Firebase Admin SDK
const adminInitStub = sinon.stub(admin, 'initializeApp');

describe('Firebase Functions', () => {
  let myFunctions: any;

  before(() => {
    // Import functions after stubbing admin.initializeApp
    myFunctions = require('../src/index');
  });

  after(() => {
    // Clean up
    testEnv.cleanup();
    adminInitStub.restore();
  });

  describe('helloWorld', () => {
    it('should return hello message', (done) => {
      const req = {
        method: 'GET',
        url: '/',
      } as any;

      const res = {
        send: (message: string) => {
          expect(message).to.equal('Hello from Firebase Functions!');
          done();
        },
      } as any;

      myFunctions.helloWorld(req, res);
    });
  });

  describe('getUserData', () => {
    it('should throw error for unauthenticated user', async () => {
      const mockContext = {
        auth: null,
      };

      const wrapped = testEnv.wrap(myFunctions.getUserData);
      
      try {
        await wrapped({}, mockContext);
        expect.fail('Expected function to throw an error');
      } catch (error: any) {
        expect(error.message).to.include('The function must be called while authenticated');
      }
    });
  });

  describe('onUserCreate', () => {
    it('should log when user is created', async () => {
      // Create a simple mock snapshot without using firebase-functions-test
      const mockData = {
        name: 'New User',
        email: 'newuser@example.com',
      };

      const mockSnapshot = {
        data: () => mockData,
        ref: {
          path: 'users/new-user-id',
        },
      };

      const mockContext = {
        params: {
          userId: 'new-user-id',
        },
      };

      const wrapped = testEnv.wrap(myFunctions.onUserCreate);
      const result = await wrapped(mockSnapshot, mockContext as any);

      expect(result).to.be.null;
    });
  });
});