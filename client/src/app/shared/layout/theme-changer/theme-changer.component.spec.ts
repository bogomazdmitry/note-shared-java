import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { ThemeChangerComponent } from './theme-changer.component';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

describe('ThemeChangerComponent', () => {
  let component: ThemeChangerComponent;
  let fixture: ComponentFixture<ThemeChangerComponent>;
  const themeService = jasmine.createSpyObj('ThemeService', [
    'toggleTheme',
    'hasDarkTheme',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeChangerComponent ],
      providers: [
          { provide: ThemeService, useValue: themeService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeChangerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call change theme after click to button', () => {
    const changeThemeButton = fixture.debugElement.nativeElement.querySelector('#button-change-theme');
    changeThemeButton.click();
    fixture.detectChanges();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('light mode icon',  () => {
    themeService.hasDarkTheme.and.returnValue(true);
    fixture.detectChanges();
    const matIcon = fixture.debugElement.nativeElement.querySelector('mat-icon');
    expect(matIcon.textContent).toContain('light_mode');
  });

  it('dark mode icon',  () => {
    themeService.hasDarkTheme.and.returnValue(false);
    fixture.detectChanges();
    const matIcon = fixture.debugElement.nativeElement.querySelector('mat-icon');
    expect(matIcon.textContent).toContain('dark_mode');
  });
});
