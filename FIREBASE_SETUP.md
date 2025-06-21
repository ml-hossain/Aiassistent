# Firebase Configuration

To use this application, you need to set up a Firebase project and configure it.

## Setup Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password
4. Enable Firestore Database
5. Copy your Firebase configuration

## Configuration:

Your Firebase configuration is already set up in `src/firebase.ts` with your project credentials.

## IMPORTANT: Firestore Security Rules

**This is critical to fix the "permission denied" error!**

Go to your Firebase Console → Firestore Database → Rules and replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own JSON records
    match /jsonRecords/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Authentication Setup

1. Go to Firebase Console → Authentication
2. Click on "Sign-in method" tab
3. Enable "Email/Password" provider
4. Save the changes

## Testing the Setup

1. Make sure you've published the Firestore security rules above
2. Run `npm run dev` to start the development server
3. Create a new account or sign in
4. Try adding some JSON data
5. Navigate to the "View Data Table" to see your data

## Troubleshooting

- **Permission denied errors**: Make sure you've updated the Firestore security rules
- **Authentication not working**: Verify Email/Password is enabled in Firebase Console
- **Data not loading**: Check browser console for specific error messages
