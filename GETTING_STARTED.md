# Getting Started Guide for New Engineers

Welcome to the Journey Home project! This comprehensive guide will help you set up your development environment and get started with contributing to the project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Initial Setup](#initial-setup)
4. [Development Environment](#development-environment)
5. [Firebase Configuration](#firebase-configuration)
6. [Testing Setup](#testing-setup)
7. [Development Workflow](#development-workflow)
8. [Deployment & CI/CD](#deployment--cicd)
9. [Project Structure](#project-structure)
10. [Troubleshooting](#troubleshooting)
11. [Useful Commands](#useful-commands)
12. [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** - [Download here](https://git-scm.com/)
- **Firebase CLI** - Install globally: `npm install -g firebase-tools`

### Recommended Tools

- **VS Code** - [Download here](https://code.visualstudio.com/)
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Firebase for VS Code
  - Playwright Test for VS Code
  - ESLint
  - Prettier

### System Requirements

- **Operating System**: macOS, Windows, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Stable connection for Firebase services and package downloads

## Project Overview

Journey Home is a Next.js application built with:

- **Frontend**: Next.js 15.5.3 with React 19.1.0
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Testing**: Playwright for E2E testing
- **Deployment**: Firebase Hosting with GitHub Actions CI/CD
- **Language**: TypeScript

### Key Features

- Modern React with App Router
- Firebase integration with emulator support
- Comprehensive testing suite
- Automated CI/CD pipeline
- Mobile-responsive design
- TypeScript for type safety

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Hack4Impact-UMD/journey-home.git
cd journey-home
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure it:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Firebase project configuration (see [Firebase Configuration](#firebase-configuration) section).

### 4. Verify Installation

```bash
# Check if everything is working
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Journey Home application running.

## Development Environment

### Firebase CLI Setup

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Verify Project Access**:
   ```bash
   firebase projects:list
   ```

3. **Set Default Project** (if needed):
   ```bash
   firebase use journey-home-e346f
   ```

### Firebase Emulators

The project uses Firebase emulators for local development. Start them with:

```bash
# Start all emulators
npm run firebase:emulator

# Or start specific emulators (Firestore and Storage only)
npm run firebase:emulator:ui
```

**Emulator URLs**:
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore**: localhost:8080
- **Storage**: localhost:9199
- **Auth**: localhost:9099

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Firebase Configuration

### Environment Variables

Configure your `.env.local` file with the following variables:

```env
# Firebase Project Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=journey-home-e346f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=journey-home-e346f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=journey-home-e346f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Emulator Configuration (for development)
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost
NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT=8080
NEXT_PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT=9199
NEXT_PUBLIC_FIREBASE_EMULATOR_AUTH_PORT=9099

# Environment
NODE_ENV=development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

### Firebase Project Setup

1. **Access Firebase Console**: Go to [Firebase Console](https://console.firebase.google.com/project/journey-home-e346f)

2. **Get Configuration Values**: 
   - Go to Project Settings → General → Your apps
   - Copy the configuration values to your `.env.local`

3. **Enable Services**:
   - **Firestore Database**: Enable in production mode
   - **Storage**: Enable with default rules
   - **Authentication**: Enable (if needed)

### Security Rules

The project includes security rules for development. For production, update:

- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules

## Testing Setup

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Test Configuration

Tests are configured to run on:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)

Test files are located in the `tests/` directory.

## Development Workflow

### 1. Branch Strategy

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Or create a bugfix branch
git checkout -b bugfix/issue-description
```

### 2. Development Process

1. **Start Development Environment**:
   ```bash
   # Terminal 1: Start Firebase emulators
   npm run firebase:emulator
   
   # Terminal 2: Start Next.js dev server
   npm run dev
   ```

2. **Make Changes**: Edit files in the `app/` directory

3. **Test Your Changes**:
   ```bash
   # Run linter
   npm run lint
   
   # Run tests
   npm test
   
   # Build the application
   npm run build
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

### 3. Code Quality

- **ESLint**: Configured for code quality
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (if configured)
- **Husky**: Pre-commit hooks (if configured)

### 4. Pull Request Process

1. Create a pull request to `main` or `develop` branch
2. Ensure all tests pass
3. Request code review
4. Address feedback
5. Merge after approval

## Deployment & CI/CD

### GitHub Actions Workflows

The project has automated CI/CD with two main workflows:

1. **Main CI Pipeline** (`.github/workflows/ci.yml`):
   - Runs on PR and push to main/develop
   - Linting and build verification
   - Playwright test execution
   - Automatic deployment to Firebase (main branch only)

2. **Playwright Tests** (`.github/workflows/playwright.yml`):
   - Matrix testing across browsers
   - Mobile device testing
   - Separate test report generation

### Deployment Process

1. **Automatic Deployment**: 
   - Pushes to `main` branch trigger automatic deployment
   - Deploys to Firebase Hosting

2. **Manual Deployment**:
   ```bash
   # Build the application
   npm run build
   
   # Deploy to Firebase
   npm run firebase:deploy
   ```

### Required GitHub Secrets

For deployment to work, these secrets must be configured in GitHub:

- `FIREBASE_TOKEN`: Firebase CI token
- `FIREBASE_PROJECT_ID`: Firebase project ID

## Project Structure

```
journey_home/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Firestore utilities
│   └── storage.ts         # Storage utilities
├── tests/                 # Playwright tests
│   └── example.spec.ts    # Example test file
├── .github/               # GitHub Actions workflows
│   └── workflows/
├── public/                # Static assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── storage.rules          # Storage security rules
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Troubleshooting

### Common Issues

#### 1. Firebase Connection Issues

**Problem**: Cannot connect to Firebase emulators
**Solution**:
```bash
# Check if emulators are running
npm run firebase:emulator

# Verify environment variables
cat .env.local
```

#### 2. Port Already in Use

**Problem**: Port 3000 or Firebase emulator ports are in use
**Solution**:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

#### 3. Playwright Browser Issues

**Problem**: Playwright tests fail due to browser issues
**Solution**:
```bash
# Reinstall Playwright browsers
npx playwright install --with-deps
```

#### 4. Build Failures

**Problem**: `npm run build` fails
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

#### 5. Firebase Authentication Issues

**Problem**: Firebase auth not working
**Solution**:
- Verify Firebase project configuration
- Check if Authentication is enabled in Firebase Console
- Ensure correct API keys in `.env.local`

### Getting Help

1. **Check Logs**: Look at browser console and terminal output
2. **Firebase Emulator UI**: Visit http://localhost:4000 for emulator status
3. **GitHub Issues**: Check existing issues or create new ones
4. **Team Communication**: Reach out to team members via Slack/Discord

## Useful Commands

### Development

```bash
# Start development server
npm run dev

# Start Firebase emulators
npm run firebase:emulator

# Start emulators with UI only
npm run firebase:emulator:ui
```

### Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Building & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Firebase
npm run firebase:deploy

# Deploy only hosting
npm run firebase:deploy:hosting
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues (if configured)
npm run lint:fix
```

### Firebase Management

```bash
# Login to Firebase
firebase login

# List projects
firebase projects:list

# Use specific project
firebase use journey-home-e346f

# Export emulator data
npm run firebase:emulator:export

# Import emulator data
npm run firebase:emulator:import
```

## Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project-Specific Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Deployment Setup Guide](./DEPLOYMENT_SETUP.md)
- [Testing Guide](./TESTING.md)

### Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [Firebase Codelabs](https://firebase.google.com/codelabs)
- [Playwright Getting Started](https://playwright.dev/docs/intro)

### Team Resources

- **Repository**: https://github.com/Hack4Impact-UMD/journey-home
- **Live Site**: https://journey-home-e346f.web.app
- **Firebase Console**: https://console.firebase.google.com/project/journey-home-e346f

---

## Quick Start Checklist

- [ ] Install Node.js (v18+)
- [ ] Install Firebase CLI globally
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Copy `env.example` to `.env.local`
- [ ] Configure Firebase project settings
- [ ] Run `npm run firebase:emulator`
- [ ] Run `npm run dev`
- [ ] Install Playwright browsers: `npx playwright install --with-deps`
- [ ] Run tests: `npm test`
- [ ] Verify everything works at http://localhost:3000

Welcome to the team! 🚀

If you have any questions or run into issues, don't hesitate to reach out to the team or create an issue in the repository.
