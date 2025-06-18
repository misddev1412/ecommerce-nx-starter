import { z } from 'zod';

// Login schemas
export const googleLoginSchema = z.object({
  firebaseToken: z.string().min(1, 'Firebase token is required'),
});

export const facebookLoginSchema = z.object({
  firebaseToken: z.string().min(1, 'Firebase token is required'),
});

// Logout schema
export const logoutSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
});

// Generate custom token schema
export const generateCustomTokenSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

// Response schemas for type safety
export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
    firebaseUid: z.string(),
    provider: z.string(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export const userProfileResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  firebaseUid: z.string(),
  provider: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const customTokenResponseSchema = z.object({
  customToken: z.string(),
});

// Type exports for use in router
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type FacebookLoginInput = z.infer<typeof facebookLoginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type GenerateCustomTokenInput = z.infer<typeof generateCustomTokenSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type CustomTokenResponse = z.infer<typeof customTokenResponseSchema>; 