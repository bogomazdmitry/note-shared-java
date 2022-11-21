import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SignUpFormService } from './signup-form.service';

@Component({
  selector: 'user-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignUpFormComponent implements OnInit {
  public buttonDisable: boolean;

  public constructor(
    private readonly authService: AuthService,
    public readonly signUpFormValidator: SignUpFormService
  ) {}

  public ngOnInit(): void {
    this.buttonDisable = false;
  }

  public onSubmit(): void {
    this.buttonDisable = true;
    this.signUpFormValidator.globalError = '';
    const signUpModel = this.signUpFormValidator.formGroup.value;
    this.authService.signUp(signUpModel, this.handleError.bind(this));
  }

  public handleError(httpErrorResponse: HttpErrorResponse): void {
    this.signUpFormValidator.handleErrors(httpErrorResponse);
    this.buttonDisable = false;
  }
}
