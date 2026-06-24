import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { ConfirmDialogService } from '../services/confirm-dialog.service';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.canDeactivate()) {
    return true;
  }

  return inject(ConfirmDialogService).confirm({
    title: 'Discard changes?',
    message: 'This course has unsaved edits. Leave the page and discard them?',
    confirmText: 'Discard',
    cancelText: 'Keep editing',
    danger: true
  });
};
