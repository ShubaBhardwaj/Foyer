export type SchedulerProvider = "memory" | "redis" | "agenda";

export interface SchedulerConfig {
  enabled: boolean;
  provider: SchedulerProvider;
  concurrency: number;
  defaultMaxRetries: number;
}

export const schedulerConfig: SchedulerConfig = Object.freeze({
  enabled: true,
  provider: "memory",
  concurrency: 5,
  defaultMaxRetries: 3,
});

export default schedulerConfig;
