import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationRequest {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  resolve: (confirmed: boolean) => void;
}

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private readonly requestSubject = new Subject<ConfirmationRequest>();
  readonly request$ = this.requestSubject.asObservable();

  confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.requestSubject.next({
        ...options,
        resolve
      });
    });
  }
}
