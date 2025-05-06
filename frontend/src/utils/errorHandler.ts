import { AxiosError } from 'axios';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom error class for network errors
 */
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Custom error class for timeout errors
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Handle API errors and return appropriate error messages
 */
export const handleApiError = (error: any): Error => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    
    // Handle network errors
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return new TimeoutError();
      }
      return new NetworkError();
    }
    
    // Handle API errors with response
    const status = axiosError.response.status;
    const data = axiosError.response.data;
    
    switch (status) {
      case 400:
        return new ApiError(
          data?.error || 'Bad request. Please check your input.',
          status,
          data
        );
      case 401:
        return new ApiError(
          data?.error || 'Unauthorized. Please log in again.',
          status,
          data
        );
      case 403:
        return new ApiError(
          data?.error || 'Forbidden. You do not have permission to access this resource.',
          status,
          data
        );
      case 404:
        return new ApiError(
          data?.error || 'Resource not found.',
          status,
          data
        );
      case 429:
        return new ApiError(
          data?.error || 'Too many requests. Please try again later.',
          status,
          data
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return new ApiError(
          data?.error || 'Server error. Please try again later.',
          status,
          data
        );
      default:
        return new ApiError(
          data?.error || `An error occurred (${status}).`,
          status,
          data
        );
    }
  }
  
  // Handle non-Axios errors
  return error instanceof Error ? error : new Error(String(error));
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return 'Network error occurred. Please check your connection.';
  }
  
  if (error instanceof TimeoutError) {
    return 'Request timed out. Please try again.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default {
  handleApiError,
  getUserFriendlyErrorMessage,
  ApiError,
  NetworkError,
  TimeoutError
};
