import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';

@Controller('trpc')
export class TrpcController {
  constructor(private readonly trpcService: TrpcService) {}

  @All('*')
  async handleTrpc(@Req() req: Request, @Res() res: Response) {
    const appRouter = this.trpcService.getAppRouter();
    
    // Create TRPC Express adapter
    const trpcHandler = trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }) => this.trpcService.createContext(req, res),
      onError: ({ error, type, path, input, ctx, req }) => {
        console.error('TRPC Error:', {
          error: error.message,
          type,
          path,
          input,
        });
      },
    });

    // Call the handler with proper signature
    trpcHandler(req, res, (err) => {
      if (err) {
        console.error('TRPC Handler Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
} 