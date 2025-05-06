import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component, currentRoute, currentState, nextState) => {
  if (component.hasUnsavedChanges()) {
    // Prompt the user to confirm leaving the page or perform other checks
    return confirm($localize`You have unsaved changes. Are you sure you want to leave?`);
  }
  return true;
};
