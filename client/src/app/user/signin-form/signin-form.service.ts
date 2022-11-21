import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { signInErrors } from 'src/app/shared/constants/errors.constants';
import { BaseFormService } from '../../shared/services/base-form.service';

@Injectable({ providedIn: 'root' })
export class SignInFormService extends BaseFormService {
  public constructor(private readonly formBuilder: FormBuilder) {
    super(signInErrors);
    this.validationErrors = this.createValidationErrors();
    this.formGroup = this.createForm();
  }

  protected createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  protected createValidationErrors(): {
    [key: string]: { [key: string]: ValidationErrors };
  } {
    return {
      email: {
        required: { required: true },
      },
      password: {
        required: { required: true },
      },
    };
  }
}
