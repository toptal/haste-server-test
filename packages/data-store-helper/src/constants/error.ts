export enum ErrorType {
  CONNECTION_ERROR = 'Can`t connect to database.',
  DOCUMENT_NOT_FOUND = 'Document is not found.',
  GET_DOCUMENT_ERROR = 'Error getting document.',
  ADD_DOCUMENT_ERROR = 'Error while adding a document.',
  DATA_EXPIRED = 'Data expired.',
  EMPTY_BODY = 'Body must not be empty.',
  FETCH_USER_ERROR = 'Error while fetching user.',
  USER_NOT_FOUND = 'User is not found.'
}
