import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      /**
       * Set by clerkAuth middleware after verifying the Clerk JWT.
       * Always present on protected routes.
       */
      auth?: {
        clerkUserId: string;
      };

      /**
       * Set by clerkAuth middleware if a linked MongoDB user exists.
       * May be undefined for unlinked users (first login before account linking).
       */
      user?: IUser;
    }
  }
}

export {};
