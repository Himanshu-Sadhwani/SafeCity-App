import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: unknown): void {
        const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        console.error('Global error:', error);
        alert(message);
    }
}
