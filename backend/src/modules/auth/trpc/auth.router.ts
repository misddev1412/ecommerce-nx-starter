import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../../../trpc/trpc';
import {
  googleLoginSchema,
  facebookLoginSchema,
  logoutSchema,
  generateCustomTokenSchema,
} from './auth.schema';

export const authRouter = router({
  // Google OAuth login
  loginGoogle: publicProcedure
    .input(googleLoginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.authService.loginWithGoogle(input.firebaseToken);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Google login failed',
          cause: error,
        });
      }
    }),

  // Facebook OAuth login
  loginFacebook: publicProcedure
    .input(facebookLoginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.authService.loginWithFacebook(input.firebaseToken);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Facebook login failed',
          cause: error,
        });
      }
    }),

  // Get current user profile (protected)
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        success: true,
        data: ctx.user, // user is guaranteed to exist due to protectedProcedure
      };
    }),

  // Logout user (protected)
  logout: protectedProcedure
    .input(logoutSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.authService.logout(input.firebaseUid);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Logout failed',
          cause: error,
        });
      }
    }),

  // Generate custom Firebase token (protected)
  generateCustomToken: protectedProcedure
    .input(generateCustomTokenSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Ensure user can only generate token for themselves or check admin permissions
        if (ctx.user.id !== input.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only generate tokens for yourself',
          });
        }

        const customToken = await ctx.authService.generateCustomToken(input.userId);
        return {
          success: true,
          data: {
            customToken,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to generate custom token',
          cause: error,
        });
      }
    }),

  // Health check endpoint
  health: publicProcedure
    .query(() => {
      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'auth',
        },
      };
    }),

  // Verify token endpoint (protected)
  verifyToken: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        success: true,
        data: {
          valid: true,
          user: ctx.user,
          timestamp: new Date().toISOString(),
        },
      };
    }),
}); 