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
    it('should be defined as a callable function', () => {
      // For now, just check that the function is defined
      // TODO: Add proper v6 callable function testing when firebase-functions-test supports it
      expect(functions.getUserData).to.be.a('function');
    });
  });

  describe('dailyCleanup', () => {
    it('should be defined as a scheduled function', () => {
      expect(functions.dailyCleanup).to.be.a('function');
    });
  });

  // onUserCreate tests commented out since the function is temporarily disabled
  // When Firestore is set up, uncomment this test and the function in index.ts
  // describe('onUserCreate', () => {
  //   it('should log when user is created', async () => {
  //     // This test would be for the Firestore trigger function
  //     // It's commented out because the function is disabled
  //   });
  // });
});