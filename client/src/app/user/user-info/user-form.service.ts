import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChangeUserInfo } from 'src/app/shared/models/change-user-info.model';
import { AuthDataService } from 'src/app/shared/services/auth.data.service';
import { UserService } from 'src/app/shared/services/user.service';
import { isUniqueSelfEmail } from 'src/app/shared/validators/email-unique-self.validator';
import { formIsChanged } from 'src/app/shared/validators/form-chaged.validator';
import { isUniqueSelfUserName } from 'src/app/shared/validators/user-name-self-validator';
import { BaseFormService as BaseFormService } from '../../shared/services/base-form.service';
import { mustMatch } from '../../shared/validators/must-match.validator';
import { patternValidator } from '../../shared/validators/regex.validator';

@Injectable({ providedIn: 'root' })
export class UserFormService extends BaseFormService {
  public changeUserInfo: ChangeUserInfo | null;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService
  ) {
    super();
    const user = this.userService.getUser();
    if (user) {
      this.changeUserInfo = {
        email: user.email,
        userName: user.userName,
        oldPassword: '',
        confirmNewPassword: '',
        newPassword: '',
      };
    }
    this.validationErrors = this.createValidationErrors();
    this.formGroup = this.createForm();
  }

  protected createForm(): FormGroup {
    return this.formBuilder.group(
      {
        userName: [this.changeUserInfo?.userName, Validators.required],
        email: [
          this.changeUserInfo?.email,
          [Validators.required, Validators.email],
        ],
        oldPassword: [
          '',
          [
            Validators.required,
            patternValidator(
              /.*[A-Z].*/,
              this.getError('oldPassword', 'hasUpperCase')
            ),
            patternValidator(
              /.*[a-z].*/,
              this.getError('oldPassword', 'hasLowerCase')
            ),
            patternValidator(/\d/, this.getError('oldPassword', 'hasNumber')),
            patternValidator(
              /^.{8,64}$/,
              this.getError('oldPassword', 'hasLength')
            ),
          ],
        ],
        newPassword: [
          '',
          [
            patternValidator(
              /.*[A-Z].*/,
              this.getError('newPassword', 'hasUpperCase')
            ),
            patternValidator(
              /.*[a-z].*/,
              this.getError('newPassword', 'hasLowerCase')
            ),
            patternValidator(/\d/, this.getError('newPassword', 'hasNumber')),
            patternValidator(
              /^.{8,64}$/,
              this.getError('newPassword', 'hasLength')
            ),
          ],
        ],
        confirmNewPassword: [''],
        globalError: [''],
      },
      {
        validator: [
          mustMatch('newPassword', 'confirmNewPassword'),
          isUniqueSelfUserName(
            this.changeUserInfo,
            this.authDataService,
            this.handleErrors.bind(this)
          ),
          isUniqueSelfEmail(
            this.changeUserInfo,
            this.authDataService,
            this.handleErrors.bind(this)
          ),
          formIsChanged(this.changeUserInfo),
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
      oldPassword: {
        hasUpperCase: { hasUpperCase: true },
        hasLowerCase: { hasLowerCase: true },
        hasNumber: { hasNumber: true },
        hasLength: { hasLength: true },
        mustMatch: { mustMatch: true },
      },
      newPassword: {
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
