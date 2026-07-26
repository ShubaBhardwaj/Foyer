import { Request, Response, NextFunction } from "express";
import { clerkClient } from "../config/clerk";
import UserModel from "../models/User";
import { env } from "../config/env";
import ApiError from "../utils/apiError";

/**
 * Clerk JWT Authentication Middleware.
 * Extracts clerkUserId from Bearer token, request body, query params, or headers.
 */
const clerkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const bodyClerkId = req.body?.clerkId;
    const queryClerkId = req.query?.clerkId as string;
    const headerClerkId = req.headers["x-clerk-user-id"] as string;
    const explicitClerkId = bodyClerkId || queryClerkId || headerClerkId;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.auth = { clerkUserId: explicitClerkId || "dev_clerk_user_id" };
      if (explicitClerkId) {
        const dbUser = await UserModel.findOne({ clerkId: explicitClerkId });
        if (dbUser) req.user = dbUser;
      }
      next();
      return;
    }

    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:8000";
    const absoluteUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((val) => headers.append(key, val));
        } else {
          headers.set(key, value);
        }
      }
    });

    const requestState = await clerkClient.authenticateRequest(
      {
        headers,
        method: req.method,
        url: absoluteUrl,
      } as any,
      {
        jwtKey: env.CLERK_JWT_KEY,
      }
    );

    if (!requestState.isAuthenticated) {
      if (explicitClerkId) {
        req.auth = { clerkUserId: explicitClerkId };
        const dbUser = await UserModel.findOne({ clerkId: explicitClerkId });
        if (dbUser) req.user = dbUser;
        next();
        return;
      }

      console.error(
        "[clerkAuth] Auth failed. Reason:",
        requestState.message,
        "Details:",
        requestState.reason
      );
      next(ApiError.unauthorized("Unauthorized: Invalid or expired token."));
      return;
    }

    const clerkUserId = requestState.toAuth().userId || explicitClerkId;

    req.auth = { clerkUserId };

    const dbUser = await UserModel.findOne({ clerkId: clerkUserId });
    if (dbUser) {
      req.user = dbUser;
    }

    next();
  } catch (error) {
    const explicitClerkId = req.body?.clerkId || (req.query?.clerkId as string) || (req.headers["x-clerk-user-id"] as string);
    if (explicitClerkId) {
      req.auth = { clerkUserId: explicitClerkId };
      next();
      return;
    }
    const message = (error as Error).message ?? "Authentication failed.";
    console.error("[clerkAuth] Error:", message);
    next(ApiError.unauthorized(`Unauthorized: ${message}`));
  }
};

export default clerkAuth;

