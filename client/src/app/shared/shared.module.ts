import { ThemeChangerComponent } from './layout/theme-changer/theme-changer.component';
import { GlobalErrorComponent } from './layout/global-error/global-error.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppBootstrapModule } from '../app-bootstrap.module';
import { AppMaterialModule } from '../app-material.module';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { CommonModule } from '@angular/common';
import { ColorCircleModule } from 'ngx-color/circle';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, GlobalErrorComponent, ThemeChangerComponent],
  imports: [
    CommonModule,
    AppBootstrapModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ColorCircleModule,
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    ThemeChangerComponent,
    GlobalErrorComponent,
    ColorCircleModule,
  ],
})
export class SharedModule {}
