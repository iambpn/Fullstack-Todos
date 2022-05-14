import { Express, Request, Response } from 'express';

export function routes(app: Express): void {
  app.get('/', (req: Request, res: Response) => {
    res.json({ data: 'success' });
  });
}
