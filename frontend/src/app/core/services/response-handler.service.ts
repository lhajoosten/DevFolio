import { Injectable } from '@angular/core';

export interface ResponseHandlerOptions {
  defaultValue?: any;
  arrayField?: string;
  itemsField?: string;
  dataField?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  /**
   * Extract array data from various API response formats
   */
  extractArrayData<T>(response: any, options: ResponseHandlerOptions = {}): T[] {
    const {
      defaultValue = [],
      arrayField = 'items',
      itemsField = 'items',
      dataField = 'data'
    } = options;

    if (!response) {
      return defaultValue;
    }

    // Direct array response
    if (Array.isArray(response)) {
      return response;
    }

    // Response with items field
    if (response[itemsField] && Array.isArray(response[itemsField])) {
      return response[itemsField];
    }

    // Response with data field
    if (response[dataField] && Array.isArray(response[dataField])) {
      return response[dataField];
    }

    // Response with custom array field
    if (arrayField !== 'items' && response[arrayField] && Array.isArray(response[arrayField])) {
      return response[arrayField];
    }

    return defaultValue;
  }

  /**
   * Extract pagination info from API response
   */
  extractPaginationInfo(response: any): { totalCount: number; pageNumber: number; pageSize: number } {
    if (!response || Array.isArray(response)) {
      return { totalCount: Array.isArray(response) ? response.length : 0, pageNumber: 1, pageSize: 10 };
    }

    return {
      totalCount: response.totalCount || response.total || 0,
      pageNumber: response.pageNumber || response.page || 1,
      pageSize: response.pageSize || response.size || 10
    };
  }

  /**
   * Check if response indicates success
   */
  isSuccessResponse(response: any): boolean {
    if (!response) return false;

    // Direct data response
    if (Array.isArray(response) || response.items || response.data) {
      return true;
    }

    // Response with success indicator
    if (typeof response.success === 'boolean') {
      return response.success;
    }

    // Response with status indicator
    if (response.status) {
      return response.status >= 200 && response.status < 300;
    }

    return true; // Assume success if no indicators
  }

  /**
   * Extract error message from error response
   */
  extractErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error && typeof error.error === 'string') {
      return error.error;
    }

    return defaultMessage;
  }
}
