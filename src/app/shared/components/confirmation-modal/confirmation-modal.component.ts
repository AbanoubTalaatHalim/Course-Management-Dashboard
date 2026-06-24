import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConfirmationRequest, ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  request: ConfirmationRequest | null = null;

  constructor() {
    inject(ConfirmDialogService).request$.pipe(takeUntilDestroyed()).subscribe((request) => {
      this.request = request;
    });
  }

  respond(confirmed: boolean): void {
    this.request?.resolve(confirmed);
    this.request = null;
  }
}
