import { FormGroup } from '@angular/forms';
import { ChangeUserInfo } from '../models/change-user-info.model';

export const formIsChanged = (
  changeUserInfo: ChangeUserInfo | null
): (formGroup: FormGroup) => void => (formGroup: FormGroup): void => {
    const newUser: ChangeUserInfo = formGroup.value;
    if (
      newUser.confirmNewPassword === changeUserInfo?.confirmNewPassword &&
      newUser.newPassword === changeUserInfo?.newPassword &&
      newUser.email === changeUserInfo?.email &&
      newUser.userName === changeUserInfo?.userName
    ) {
      formGroup.controls.globalError.setErrors({ noChanges: true });
    } else {
      formGroup.controls.globalError.setErrors(null);
    }
  };
