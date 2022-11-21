import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthDataService } from 'src/app/shared/services/auth.data.service';
import { isUniqueEmail } from 'src/app/shared/validators/email-unique.validator';
import { mustMatch } from 'src/app/shared/validators/must-match.validator';
import { patternValidator } from 'src/app/shared/validators/regex.validator';
import { isUniqueUserName } from 'src/app/shared/validators/user-name-unique.validator';
import { BaseFormService } from '../../shared/services/base-form.service';

@Injectable({ providedIn: 'root' })
export class SignUpFormService extends BaseFormService {
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authDataService: AuthDataService
  ) {
    super();
    this.validationErrors = this.createValidationErrors();
    this.formGroup = this.createForm();
  }

  protected createForm(): FormGroup {
    return this.formBuilder.group(
      {
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            patternValidator(
              /.*[A-Z].*/,
              this.getError('password', 'hasUpperCase')
            ),
            patternValidator(
              /.*[a-z].*/,
              this.getError('password', 'hasLowerCase')
            ),
            patternValidator(/\d/, this.getError('password', 'hasNumber')),
            patternValidator(
              /^.{8,64}$/,
              this.getError('password', 'hasLength')
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: [
          mustMatch('password', 'confirmPassword'),
          isUniqueUserName(this.authDataService, this.handleErrors.bind(this)),
          isUniqueEmail(this.authDataService, this.handleErrors.bind(this)),
        ],
      }
    );
  }

  protected createValidationErrors(): {
    [key: string]: { [key: string]: ValidationErrors };
  } {
    return {
      userName: {
        required: { required: true },
        notUnique: { notUnique: true },
      },
      email: {
        email: { email: true },
        required: { required: true },
        notUnique: { notUnique: true },
      },
      password: {
        hasUpperCase: { hasUpperCase: true },
        hasLowerCase: { hasLowerCase: true },
        hasNumber: { hasNumber: true },
        hasLength: { hasLength: true },
      },
      confirmPassword: {
        required: { required: true },
        mustMatch: { mustMatch: true },
      },
    };
  }
}
