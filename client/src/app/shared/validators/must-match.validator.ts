import { FormGroup } from '@angular/forms';

export const mustMatch = (name: string, matchingName: string): (formGroup: FormGroup) => void => (formGroup: FormGroup): void => {
    if (formGroup.controls[name].value !== formGroup.controls[matchingName].value) {
      formGroup.controls[matchingName].setErrors({ mustMatch: true });
    } else {
      formGroup.controls[matchingName].setErrors(null);
    }
  };
