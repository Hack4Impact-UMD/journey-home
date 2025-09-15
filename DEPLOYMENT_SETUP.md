# Firebase Deployment Setup Guide

This guide will help you set up Firebase deployment for your CI/CD pipeline.

## Option 1: Using Firebase Token (Simplest)

### Step 1: Get Firebase Token
Run this command locally (already done):
```bash
firebase login:ci
```

You received this token:
```
1//05I9TxZb0anvcCgYIARAAGAUSNwF-L9Irmr-sztcRThh2_KPOTujOQ16TeEoVz7bmCykL0vcX5495ixfTZUeuQjPuarTjm9UaZlA
```

### Step 2: Add GitHub Secrets
1. Go to your GitHub repository: https://github.com/Hack4Impact-UMD/journey-home
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add these secrets:

| Secret Name | Secret Value |
|-------------|--------------|
| `FIREBASE_TOKEN` | `1//05I9TxZb0anvcCgYIARAAGAUSNwF-L9Irmr-sztcRThh2_KPOTujOQ16TeEoVz7bmCykL0vcX5495ixfTZUeuQjPuarTjm9UaZlA` |
| `FIREBASE_PROJECT_ID` | `journey-home-e346f` |

### Step 3: Update CI Workflow
The workflow is already configured to use these secrets.

## Option 2: Using Service Account (More Secure)

### Step 1: Generate Service Account
1. Go to [Firebase Console](https://console.firebase.google.com/project/journey-home-e346f/settings/serviceaccounts/adminsdk)
2. Click **Generate new private key**
3. Download the JSON file

### Step 2: Add GitHub Secrets
1. Go to your GitHub repository settings
2. Add these secrets:

| Secret Name | Secret Value |
|-------------|--------------|
| `FIREBASE_SERVICE_ACCOUNT` | Contents of the downloaded JSON file |
| `FIREBASE_PROJECT_ID` | `journey-home-e346f` |

## Current Setup

Your project is configured with:
- **Firebase Project ID**: `journey-home-e346f`
- **Hosting URL**: https://journey-home-e346f.web.app
- **CI/CD Pipeline**: Configured to deploy on push to main branch

## Testing the Setup

### Test Local Deployment
```bash
npm run build
firebase deploy --only hosting
```

### Test CI/CD
1. Create a new branch: `git checkout -b test-deployment`
2. Make a small change to `app/page.tsx`
3. Commit and push: `git add . && git commit -m "Test deployment" && git push`
4. Create a pull request
5. Merge to main branch
6. Check GitHub Actions tab for deployment status

## Troubleshooting

### Common Issues

1. **"Input required and not supplied: firebaseServiceAccount"**
   - Solution: Add the `FIREBASE_SERVICE_ACCOUNT` secret to GitHub

2. **"Project not found"**
   - Solution: Verify `FIREBASE_PROJECT_ID` secret is set correctly

3. **"Permission denied"**
   - Solution: Ensure the Firebase token/service account has proper permissions

### Manual Deployment
If CI/CD fails, you can deploy manually:
```bash
npm run build
firebase deploy --only hosting
```

## Security Notes

- Never commit Firebase tokens or service account keys to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your Firebase tokens
- Use service accounts for production deployments

## Next Steps

1. Add the required GitHub secrets
2. Test the deployment by creating a pull request
3. Monitor the GitHub Actions tab for successful deployments
4. Your site will be automatically deployed to: https://journey-home-e346f.web.app
