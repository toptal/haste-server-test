declare module 'connect-ratelimit' {
  function connectRateLimit(
    as: RateLimits
  ): (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void

  export = connectRateLimit
}

declare namespace Express {
  interface Request {
    userId?: string
    documentKey?: string
  }
}
