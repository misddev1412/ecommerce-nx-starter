# 🔥 Firebase Authentication Setup Guide

This guide explains how to configure Firebase Authentication with Google and Facebook OAuth for the e-commerce backend.

## 📋 Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Google and Facebook developer accounts
- Node.js and yarn installed

## 🚀 Quick Start

### 1. Firebase Project Setup

1. **Create Firebase Project**
   ```
   1. Go to https://console.firebase.google.com/
   2. Click "Add project"
   3. Enter project name (e.g., "ecommerce-app")
   4. Enable Google Analytics (optional)
   5. Create project
   ```

2. **Enable Authentication Providers**
   ```
   1. Navigate to Authentication > Sign-in method
   2. Enable Google:
      - Click on Google provider
      - Enable and configure OAuth consent screen
      - Note down Web client ID and secret
   
   3. Enable Facebook:
      - Click on Facebook provider
      - Add App ID and App Secret from Facebook Developer Console
      - Add OAuth redirect URI: https://your-project.firebaseapp.com/__/auth/handler
   ```

3. **Generate Service Account Key**
   ```
   1. Go to Project Settings > Service accounts
   2. Click "Generate new private key"
   3. Download the JSON file
   4. Extract the following values for .env file:
      - project_id
      - private_key_id  
      - private_key
      - client_email
      - client_id
      - client_x509_cert_url
   ```

### 2. Environment Configuration

Update your `backend/.env` file with actual Firebase credentials:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour-actual-private-key\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
```

### 3. Test the Setup

1. **Start the backend server:**
   ```bash
   yarn nx serve backend
   ```

2. **Run the test script:**
   ```bash
   cd backend
   node test-auth.js
   ```

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/google` | Google OAuth login | No |
| POST | `/auth/facebook` | Facebook OAuth login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/verify` | Verify JWT token | Yes |
| GET | `/auth/health` | Health check | No |

### Request/Response Examples

#### Google Login
```bash
POST /auth/google
Content-Type: application/json

{
  "firebaseToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatar": "https://lh3.googleusercontent.com/...",
    "status": "active"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

#### Protected Route Access
```bash
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 🛡️ Security Features

- **Short-lived access tokens** (15 minutes)
- **Long-lived refresh tokens** (7 days)
- **Firebase token verification** before JWT generation
- **User status validation** (active users only)
- **Provider verification** (Google/Facebook)
- **Comprehensive error handling**

## 🎨 Frontend Integration

### React/Vue.js Example

```javascript
import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase (add to your main.js/index.js)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

firebase.initializeApp(firebaseConfig);

// Google Login
async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const idToken = await result.user.getIdToken();
    
    // Send token to your backend
    const response = await fetch('/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken: idToken }),
    });
    
    const data = await response.json();
    
    // Store JWT tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Facebook Login
async function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  // Similar implementation to Google
}

// Use JWT token for API calls
function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
```

## 🧪 Testing

### Manual Testing with cURL

```bash
# Test health endpoint
curl -X GET http://localhost:3000/auth/health

# Test protected route (should fail)
curl -X GET http://localhost:3000/auth/profile

# Test Google login (should fail with invalid token)
curl -X POST http://localhost:3000/auth/google \
  -H "Content-Type: application/json" \
  -d '{"firebaseToken":"invalid-token"}'
```

### Automated Testing

The `test-auth.js` script validates:
- ✅ Health endpoint accessibility
- ✅ Protected routes require authentication
- ✅ OAuth endpoints validate Firebase tokens
- ✅ Proper error responses

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase initialization failed"**
   - Check if all Firebase credentials are correctly set in .env
   - Ensure private key format is correct (with \n for line breaks)

2. **"Invalid or expired token"**
   - Verify Firebase token is valid and not expired
   - Check if user exists in Firebase Auth

3. **"User not found"**
   - User might be deleted from Firebase Auth
   - Database connection issues

4. **CORS errors in frontend**
   - Add your frontend domain to Firebase Auth authorized domains
   - Configure CORS in NestJS backend

### Debug Mode

Enable debug logging by setting in .env:
```bash
NODE_ENV=development
```

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [NestJS Passport Documentation](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🔄 Next Steps

1. Configure actual Firebase project credentials
2. Set up Facebook Developer App
3. Implement frontend Firebase SDK integration
4. Add refresh token rotation
5. Implement role-based access control (RBAC)
6. Add rate limiting and security headers 