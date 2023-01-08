import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from './header.component';
import { Location } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const authService = jasmine.createSpyObj('AuthService', [
    'isAuthorize', 'signOut'
  ]);
  const router = jasmine.createSpyObj('Router', [
    'url',
  ]);
  const activatedRouter = jasmine.createSpyObj('ActivatedRoute', [
    'snapshot',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    activatedRouter.snapshot = { queryParams: { backUrl: '' } };
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if user is authorize show sign out button and do not show sign up and sign in', () => {
    authService.isAuthorize.and.returnValue(true);
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    const signOutButtons = Array.from(buttons).filter((b: any) => b.textContent.toLowerCase().includes('выход'));
    expect(signOutButtons.length).toEqual(1);
    const signInOrUpButtons = Array.from(buttons).filter(
      (b: any) => b.textContent.includes('Регистрация') || b.textContent.toLowerCase().includes('вход')
    );
    expect(signInOrUpButtons.length).toEqual(0);
  });

  it('if user is not authorize show sign in and sign up buttons and do not show sign out', () => {
    authService.isAuthorize.and.returnValue(false);
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    const signOutButtons = Array.from(buttons).filter((b: any) => b.textContent.toLowerCase().includes('выход'));
    expect(signOutButtons.length).toEqual(0);
    const signInButtons = Array.from(buttons).filter(
      (b: any) => b.textContent.toLowerCase().includes('вход')
    );
    expect(signInButtons.length).toEqual(1);
    const signUpButtons = Array.from(buttons).filter(
      (b: any) => b.textContent.toLowerCase().includes('регистрация')
    );
    expect(signUpButtons.length).toEqual(1);
  });

  it('click sign out button', () => {
    authService.isAuthorize.and.returnValue(true);
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    const signOutButtons: any = Array.from(buttons).filter(
      (b: any) => b.textContent.toLowerCase().includes('выход')
    );
    signOutButtons[0].click();
    expect(authService.signOut).toHaveBeenCalled();
  });

  it('url in sign in button', () => {
    authService.isAuthorize.and.returnValue(false);
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    const signInButtons: any = Array.from(buttons).filter(
      (b: any) => b.textContent.toLowerCase().includes('вход')
    );
    expect(signInButtons[0].getAttribute('routerLink')).toEqual('/user/signin');
  });

  it('url in sign up button', () => {
    authService.isAuthorize.and.returnValue(false);
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    const signUpButtons: any = Array.from(buttons).filter(
      (b: any) => b.textContent.toLowerCase().includes('регистрация')
    );
    expect(signUpButtons[0].getAttribute('routerLink')).toEqual('/user/signup');
  });
});
