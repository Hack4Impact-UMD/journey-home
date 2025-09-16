# Firebase Functions for Journey Home

This directory contains Firebase Cloud Functions for the Journey Home application.

## Overview

The Firebase Functions provide server-side functionality including:
- HTTP endpoints for API calls
- Callable functions for client-side integration
- Firestore triggers for data processing
- Scheduled functions for maintenance tasks

## Functions

### HTTP Functions
- `helloWorld` - Simple HTTP endpoint that returns a greeting message

### Callable Functions
- `getUserData` - Retrieves user data from Firestore (requires authentication)

### Firestore Triggers
- `onUserCreate` - Triggered when a new user document is created in Firestore

### Scheduled Functions
- `dailyCleanup` - Runs daily at midnight UTC for maintenance tasks

## Development

### Prerequisites
- Node.js 18+
- Firebase CLI
- Firebase project with Functions enabled

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the functions:
   ```bash
   npm run build
   ```

3. Start the Firebase emulator:
   ```bash
   npm run serve
   ```

### Testing

The functions use Mocha and Chai for testing, following Firebase's recommended testing patterns.

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode for development:
```bash
npm run test:watch
```

### Deployment

Deploy all functions:
```bash
npm run deploy
```

Deploy specific function:
```bash
firebase deploy --only functions:functionName
```

## Project Structure

```
functions/
├── src/
│   ├── index.ts          # Main functions file
│   └── __tests__/        # Test files (if using Jest)
├── test/                 # Mocha test files
├── lib/                  # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Testing Strategy

The tests use the `firebase-functions-test` SDK in offline mode for:
- Fast execution
- No external dependencies
- Isolated unit tests

### Test Categories
1. **HTTP Functions** - Test request/response handling
2. **Callable Functions** - Test authentication and data retrieval
3. **Firestore Triggers** - Test document change handling
4. **Error Handling** - Test error scenarios and edge cases

## CI/CD Integration

The functions are integrated into the GitHub Actions CI/CD pipeline:
- Tests run on every pull request
- Functions are built and deployed on main branch pushes
- Test coverage is reported and uploaded as artifacts

## Environment Variables

Functions can use Firebase config for environment-specific values:
```javascript
const functions = require('firebase-functions');
const config = functions.config();
```

## Security

- All callable functions require authentication
- Firestore security rules are enforced
- Input validation is performed on all functions
- Error messages don't expose sensitive information

## Monitoring

Functions include comprehensive logging:
- Structured logging with severity levels
- Error tracking and reporting
- Performance monitoring
- Usage analytics

## Contributing

1. Write tests for new functions
2. Follow TypeScript best practices
3. Update documentation
4. Ensure all tests pass before submitting PR
