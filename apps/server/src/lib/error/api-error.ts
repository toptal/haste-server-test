import { StatusCodes, ReasonPhrases } from 'http-status-codes'

export default abstract class ApiError extends Error {
  constructor(
    public name: ReasonPhrases,
    public status: StatusCodes,
    message?: string
  ) {
    super(message)
  }
}
