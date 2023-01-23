import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ChangeUserInfo } from '../models/change-user-info.model';
import { AuthDataService } from '../services/auth.data.service';

export const isUniqueSelfEmail = (
  changeUserInfo: ChangeUserInfo | null,
  authDataService: AuthDataService,
  handleErrors: (httpErrorResponse: HttpErrorResponse) => void
): (formGroup: FormGroup) => void => (formGroup: FormGroup): void => {
    const formGroupEmail = formGroup.controls.email;
    const email = formGroupEmail.value;
    if (!formGroupEmail.pristine && !formGroupEmail.invalid && email !== changeUserInfo?.email) {
      authDataService.checkUniqueEmail(email).subscribe(
        (answer) => {},
        (httpErrorResponse) => {
          // eslint-disable-next-line no-console
          console.trace();
          console.log(httpErrorResponse);
          httpErrorResponse = 'email notUnique';
          handleErrors(httpErrorResponse);
        }
      );
    }
  };
