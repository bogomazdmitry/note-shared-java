import { AutofillMonitor } from '@angular/cdk/text-field';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SignInFormService } from './signin-form.service';

@Component({
  selector: 'user-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  @Input()
  public backUrl: string | undefined;
  public buttonDisable: boolean;

  public constructor(
    private readonly authService: AuthService,
    private readonly activatedRouter: ActivatedRoute,
    public readonly signInFormValidator: SignInFormService,
    public readonly autofillMonitor: AutofillMonitor
  ) {}

  public ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((queryParam: any) => {
      const backUrl = 'backUrl';
      this.backUrl = queryParam[backUrl];
    });
    this.buttonDisable = false;
  }

  public onSubmit(): void {
    this.buttonDisable = true;
    this.signInFormValidator.globalError = '';
    const signinModel = this.signInFormValidator.formGroup.value;
    this.authService.signIn(
      signinModel,
      this.backUrl,
      this.handleErrors.bind(this)
    );
  }

  public handleErrors(httpErrorResponse: HttpErrorResponse): void {
    this.signInFormValidator.handleErrors(httpErrorResponse);
    this.buttonDisable = false;
  }
}
