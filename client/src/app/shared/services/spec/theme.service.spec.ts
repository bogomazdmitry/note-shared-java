
import { TestBed } from '@angular/core/testing';
import { fieldLocalStorage } from '../../constants/local-storage.constants';
import { ThemeService } from '../theme.service';

describe('ThemeService', () => {
  let service: ThemeService;


  beforeEach(() => {
    TestBed.configureTestingModule({});

    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should be dark theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'dark-theme');
    service = TestBed.inject(ThemeService);
    expect(service.hasDarkTheme()).toBeTrue();
  });

  it('should be light theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'light-theme');
    service = TestBed.inject(ThemeService);
    expect(service.hasDarkTheme()).toBeFalse();
  });

  it('subject with light theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'light-theme');
    service = TestBed.inject(ThemeService);
    service.getChangingThemeSubject().subscribe((result) => {
      expect(result).toBeFalse();
    });
  });

  it('subject with dark theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'dark-theme');
    service = TestBed.inject(ThemeService);
    service.getChangingThemeSubject().subscribe((result) => {
      expect(result).toBeTrue();
    });
  });

  it('toggle theme with dark theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'light-theme');
    service = TestBed.inject(ThemeService);
    service.toggleTheme();
    service.getChangingThemeSubject().subscribe((result) => {
      const themeString = localStorage.getItem(fieldLocalStorage.theme);
      expect(result).toBeTrue();
      expect(themeString).toEqual('dark-theme');
      expect(document.body.classList.contains('dark-theme')).toBeTrue();
    });
  });

  it('toggle theme with light theme', () => {
    localStorage.setItem(fieldLocalStorage.theme, 'dark-theme');
    service = TestBed.inject(ThemeService);
    service.toggleTheme();
    service.getChangingThemeSubject().subscribe((result) => {
      const themeString = localStorage.getItem(fieldLocalStorage.theme);
      expect(result).toBeFalse();
      expect(themeString).toEqual('light-theme');
      expect(document.body.classList.contains('light-theme')).toBeTrue();
    });
  });
});
