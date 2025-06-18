import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { TrpcService } from './trpc.service';

// Get the router type from the service
type AppRouter = ReturnType<TrpcService['getAppRouter']>;

// Export type-safe input and output types for client usage
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Export the router type itself
export type { AppRouter }; 