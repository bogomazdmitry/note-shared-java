import { Component, OnInit } from '@angular/core';
import { ChangeUserInfo } from 'src/app/shared/models/change-user-info.model';
import { UserDataService } from 'src/app/shared/services/user.data.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserFormService } from 'src/app/user/user-info/user-form.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public buttonDisable: boolean;
  public globalSuccess: string;

  public constructor(
    private readonly userService: UserService,
    private readonly userDataService: UserDataService,
    public userFormValidation: UserFormService
  ) {}

  public ngOnInit(): void {
    this.buttonDisable = false;
  }

  public onSubmit(): void {
    this.buttonDisable = true;
    const newUser: ChangeUserInfo = this.userFormValidation.formGroup.value;
    this.userDataService.changeUserInfo(newUser).subscribe(
      (userInfo) => {
        this.userFormValidation.changeUserInfo = {
          email: userInfo.email,
          userName: userInfo.userName,
          oldPassword: '',
          confirmNewPassword: '',
          newPassword: '',
        };
        this.userService.saveUser(userInfo);
        this.globalSuccess = 'Changed!';
        this.buttonDisable = false;
      },
      (httpErrorResponse) => {
        this.globalSuccess = '';
        this.userFormValidation.handleErrors(httpErrorResponse);
        this.buttonDisable = false;
      }
    );
  }
}
