/**
 * Background Job Categories.
 */
export enum JobType {
  VISITOR_EXPIRY = "VISITOR_EXPIRY",
  NOTICE_EXPIRY = "NOTICE_EXPIRY",
  BOOKING_REMINDER = "BOOKING_REMINDER",
  PAYMENT_REMINDER = "PAYMENT_REMINDER",
  DAILY_DIGEST = "DAILY_DIGEST",
  CLEANUP_EXPIRED_DATA = "CLEANUP_EXPIRED_DATA",
}

/**
 * Background Job Execution Status.
 */
export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

/**
 * Generic Job Handler function contract.
 */
export type JobHandler<TData = any> = (data?: TData) => Promise<any>;

/**
 * Background Job Definition contract.
 */
export interface JobDefinition<TData = any> {
  id: string;
  type: JobType;
  handler: JobHandler<TData>;
  schedule?: string;
  data?: TData;
  status: JobStatus;
  createdAt: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
  lastError?: string;
}

export interface RegisterJobOptions<TData = any> {
  id?: string;
  schedule?: string;
  data?: TData;
}
