import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

// Initialize TRPC
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause && typeof error.cause === 'object' && 'flatten' in error.cause
            ? (error.cause as any).flatten()
            : null,
      },
    };
  },
});

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now guaranteed to be defined
    },
  });
});

export { type Context } from './context'; 