import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Check if Firebase is already initialized
      if (!admin.apps.length) {
        const firebaseConfig = {
          type: 'service_account',
          project_id: this.configService.get('FIREBASE_PROJECT_ID'),
          private_key_id: this.configService.get('FIREBASE_PRIVATE_KEY_ID'),
          private_key: this.configService.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
          client_email: this.configService.get('FIREBASE_CLIENT_EMAIL'),
          client_id: this.configService.get('FIREBASE_CLIENT_ID'),
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: this.configService.get('FIREBASE_CLIENT_CERT_URL'),
        };

        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
          databaseURL: `https://${this.configService.get('FIREBASE_PROJECT_ID')}.firebaseio.com`,
        });

        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
      throw new Error('Firebase initialization failed');
    }
  }

  /**
   * Verify Firebase ID token and return decoded token
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      this.logger.log(`Token verified for user: ${decodedToken.uid}`);
      return decodedToken;
    } catch (error) {
      this.logger.error('Failed to verify ID token', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get user info from Firebase Auth
   */
  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      this.logger.error(`Failed to get user ${uid}`, error);
      throw new UnauthorizedException('User not found');
    }
  }

  /**
   * Create custom token for user
   */
  async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    try {
      const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
      return customToken;
    } catch (error) {
      this.logger.error(`Failed to create custom token for user ${uid}`, error);
      throw new Error('Token creation failed');
    }
  }

  /**
   * Revoke refresh tokens for user (for logout)
   */
  async revokeRefreshTokens(uid: string): Promise<void> {
    try {
      await admin.auth().revokeRefreshTokens(uid);
      this.logger.log(`Refresh tokens revoked for user: ${uid}`);
    } catch (error) {
      this.logger.error(`Failed to revoke tokens for user ${uid}`, error);
      throw new Error('Token revocation failed');
    }
  }

  /**
   * Verify user provider (Google or Facebook)
   */
  getProviderFromToken(decodedToken: admin.auth.DecodedIdToken): string {
    const providerData = decodedToken.firebase?.identities;
    
    if (providerData?.['google.com']) {
      return 'google';
    } else if (providerData?.['facebook.com']) {
      return 'facebook';
    } else {
      return 'email';
    }
  }
} 