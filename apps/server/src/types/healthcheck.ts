/* eslint-disable camelcase */

export enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  DEGRADED = 'DEGRADED'
}

export type ServiceStatus = HealthStatus

export interface HealthcheckResult {
  service_status: ServiceStatus
}
