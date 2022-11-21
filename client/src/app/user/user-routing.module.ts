import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/access/auth.guard';
import { UnAuthGuard } from '../shared/access/unauth.guard';
import { SignInFormComponent } from './signin-form/signin-form.component';
import { SignUpFormComponent } from './signup-form/signup-form.component';
import { UserInfoComponent } from './user-info/user-info.component';

const userRoutes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'signin',
        component: SignInFormComponent,
        canActivate: [UnAuthGuard],
      },
      {
        path: 'signup',
        component: SignUpFormComponent,
        canActivate: [UnAuthGuard],
      },
      {
        path: 'info',
        component: UserInfoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
