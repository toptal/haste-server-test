import {
  HealthcheckResult,
  ServiceStatus,
  HealthStatus
} from '~/types/healthcheck'

const healthcheck = async (): Promise<HealthcheckResult> => {
  const serviceStatus: ServiceStatus = HealthStatus.UP

  return {
    // eslint-disable-next-line camelcase
    service_status: serviceStatus
  }
}

export default healthcheck
