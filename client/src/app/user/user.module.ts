import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SignInFormComponent } from './signin-form/signin-form.component';
import { SignUpFormComponent } from './signup-form/signup-form.component';
import { UserInfoComponent } from './user-info/user-info.component';

@NgModule({
  declarations: [SignInFormComponent, SignUpFormComponent, UserInfoComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
