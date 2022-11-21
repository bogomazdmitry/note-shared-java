import { Injectable } from '@angular/core';
import { blackPalette, lightPalette } from '../constants/colors.constants';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class ColorPaletteService {

  public palette: { color: string; title: string }[];

  public colors: string[];

  constructor(private readonly themeService: ThemeService) {
    this.themeService.getChangingThemeSubject().subscribe((isDarkTheme) => {
      this.palette = isDarkTheme ? blackPalette : lightPalette;
      this.colors = this.palette.map((el) => el.color);
    });
  }

  public getColorHexFromPalletByColorTitle(
    colorTitle: string | undefined
  ): string | undefined {
    return this.palette.find((el) => el.title === colorTitle)?.color;
  }

  public getColorTitleFromPalletByColorHex(
    colorHex: string | undefined
  ): string | undefined {
    return this.palette.find((el) => el.color === colorHex)?.title;
  }
}
