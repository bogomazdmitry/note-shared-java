import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { fieldLocalStorage } from '../constants/local-storage.constants';
import { User } from '../models/user.model';
import { UserDataService } from './user.data.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  public constructor(private readonly userDataService: UserDataService) {}

  public saveUser(userInfo: User): void {
    localStorage.setItem(fieldLocalStorage.user, JSON.stringify(userInfo));
  }

  public getUser(): User | null {
    const userInfo = localStorage.getItem(fieldLocalStorage.user);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  public getUserFromServer(): Observable<User> {
    return this.userDataService.getUserInfo();
  }

  public getUserFromServerInfoAndSave(): Subscription {
    return this.getUserFromServer().subscribe((answer) => {
      this.saveUser(answer);
    });
  }
}
