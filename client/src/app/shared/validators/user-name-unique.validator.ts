import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { AuthDataService } from '../services/auth.data.service';

export const isUniqueUserName = (
  authDataService: AuthDataService,
  handleErrors: (httpErrorResponse: HttpErrorResponse) => void
): (formGroup: FormGroup) => void => (formGroup: FormGroup): void => {
    const formGroupUserName = formGroup.controls.userName;
    const userName = formGroupUserName.value;
    if (!formGroupUserName.pristine && !formGroupUserName.invalid) {
      authDataService.checkUniqueUserName(userName).subscribe(
        (answer) => {},
        (httpErrorResponse) => {
          httpErrorResponse = 'userName notUnique';
          handleErrors(httpErrorResponse);
        }
      );
    }
  };
