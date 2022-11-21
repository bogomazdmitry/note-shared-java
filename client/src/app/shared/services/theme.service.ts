import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { fieldLocalStorage } from '../constants/local-storage.constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkTheme = false;
  private darkThemeString = 'dark-theme';
  private lightThemeString = 'light-theme';
  private subjectIsDarkTheme: BehaviorSubject<boolean>;

  public constructor() {
    const themeString = localStorage.getItem(fieldLocalStorage.theme);
    if (themeString && themeString === this.darkThemeString) {
      this.isDarkTheme = true;
      document.body.classList.add(this.darkThemeString);
    }
    else {
      document.body.classList.add(this.lightThemeString);
    }
    this.subjectIsDarkTheme = new BehaviorSubject<boolean>(
      this.isDarkTheme
    );
  }

  public toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.subjectIsDarkTheme.next(this.isDarkTheme);
    if (this.isDarkTheme) {
      document.body.classList.add(this.darkThemeString);
      document.body.classList.remove(this.lightThemeString);
      localStorage.setItem(fieldLocalStorage.theme, this.darkThemeString);
    } else {
      document.body.classList.add(this.lightThemeString);
      document.body.classList.remove(this.darkThemeString);
      localStorage.setItem(fieldLocalStorage.theme, this.lightThemeString);
    }
  }

  public hasDarkTheme(): boolean {
    return this.isDarkTheme;
  }

  public getChangingThemeSubject(): BehaviorSubject<boolean> {
    return this.subjectIsDarkTheme;
  }
}
