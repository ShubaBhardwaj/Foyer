import {
  JobType,
  JobStatus,
  JobHandler,
  JobDefinition,
  RegisterJobOptions,
} from "../types/job.types";
import ApiError from "../utils/apiError";

/**
 * JobService — Provider-agnostic background jobs abstraction layer.
 * Manages an in-memory job registry for asynchronous task execution.
 */
class JobService {
  private jobs: Map<string, JobDefinition> = new Map();

  /**
   * Register a new background job definition.
   */
  registerJob<TData = any>(
    type: JobType,
    handler: JobHandler<TData>,
    options: RegisterJobOptions<TData> = {}
  ): JobDefinition<TData> {
    if (!type) {
      throw ApiError.badRequest("Job type is required.");
    }
    if (!handler || typeof handler !== "function") {
      throw ApiError.badRequest("Valid job handler function is required.");
    }

    const id =
      options.id ||
      `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const job: JobDefinition<TData> = {
      id,
      type,
      handler,
      schedule: options.schedule,
      data: options.data,
      status: JobStatus.PENDING,
      createdAt: new Date(),
    };

    this.jobs.set(id, job);
    return job;
  }

  /**
   * Execute a registered job by its ID.
   */
  async executeJob(id: string): Promise<any> {
    const job = this.jobs.get(id);

    if (!job) {
      throw ApiError.notFound(`Job with ID "${id}" not found.`);
    }

    if (job.status === JobStatus.RUNNING) {
      throw ApiError.badRequest(`Job "${id}" is already running.`);
    }

    if (job.status === JobStatus.CANCELLED) {
      throw ApiError.badRequest(`Cannot execute cancelled job "${id}".`);
    }

    job.status = JobStatus.RUNNING;
    job.lastRunAt = new Date();

    try {
      const result = await job.handler(job.data);
      job.status = JobStatus.COMPLETED;
      return result;
    } catch (error: unknown) {
      job.status = JobStatus.FAILED;
      job.lastError =
        error instanceof Error
          ? error.message
          : "Unknown error during job execution";
      throw ApiError.internal(`Job execution failed (${id}): ${job.lastError}`);
    }
  }

  /**
   * Cancel a pending or running job.
   */
  cancelJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;

    job.status = JobStatus.CANCELLED;
    return true;
  }

  /**
   * Get a job definition by ID.
   */
  getJob(id: string): JobDefinition | undefined {
    return this.jobs.get(id);
  }

  /**
   * List all registered jobs, optionally filtering by JobType.
   */
  listJobs(filterType?: JobType): JobDefinition[] {
    const allJobs = Array.from(this.jobs.values());
    if (filterType) {
      return allJobs.filter((job) => job.type === filterType);
    }
    return allJobs;
  }
}

export default new JobService();
