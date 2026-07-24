import { Request, Response, NextFunction } from "express";
import { clerkClient } from "../config/clerk";
import UserModel from "../models/User";

/**
 * Clerk JWT Authentication Middleware.
 *
 * Workflow:
 * 1. Extract the Bearer token from the Authorization header.
 * 2. Verify the token using Clerk's Backend SDK.
 * 3. If valid, attach `req.auth.clerkUserId`.
 * 4. Look up the MongoDB user by clerkId via Mongoose model — attach to `req.user` if found.
 * 5. Proceed to the next middleware/handler.
 */
const clerkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or malformed Authorization header.",
        data: null,
      });
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
        jwtKey: process.env.CLERK_JWT_KEY,
      }
    );

    if (!requestState.isAuthenticated) {
      console.error(
        "[clerkAuth] Auth failed. Reason:",
        requestState.message,
        "Details:",
        requestState.reason
      );
      res.status(401).json({
        success: false,
        message: `Unauthorized: Invalid or expired token.`,
        data: null,
      });
      return;
    }

    const clerkUserId = requestState.toAuth().userId;

    // Attach verified Clerk User ID
    req.auth = { clerkUserId };

    // Query MongoDB directly with Mongoose model
    const dbUser = await UserModel.findOne({ clerkId: clerkUserId });
    if (dbUser) {
      req.user = dbUser;
    }

    next();
  } catch (error) {
    const message = (error as Error).message ?? "Authentication failed.";
    console.error("[clerkAuth] Error:", message);
    res.status(401).json({
      success: false,
      message: `Unauthorized: ${message}`,
      data: null,
    });
  }
};

export default clerkAuth;
