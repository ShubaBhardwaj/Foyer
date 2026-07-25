import { Response } from "express";

/**
 * Standardized API response helper.
 */
class ApiResponse {
  static ok<T = any>(
    res: Response,
    message: string,
    data: T | null = null,
    meta?: Record<string, any>
  ): Response {
    const responsePayload: Record<string, any> = {
      success: true,
      message,
      data,
    };

    if (meta !== undefined) {
      responsePayload.meta = meta;
    }

    return res.status(200).json(responsePayload);
  }

  static created<T = any>(
    res: Response,
    message: string,
    data: T | null = null,
    meta?: Record<string, any>
  ): Response {
    const responsePayload: Record<string, any> = {
      success: true,
      message,
      data,
    };

    if (meta !== undefined) {
      responsePayload.meta = meta;
    }

    return res.status(201).json(responsePayload);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

export default ApiResponse;
