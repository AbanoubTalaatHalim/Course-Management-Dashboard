import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = toSignal(this.toastService.toasts$, { initialValue: [] });

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
