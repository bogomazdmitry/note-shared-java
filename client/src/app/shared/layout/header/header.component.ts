import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public backUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRouter: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.backUrl = this.activatedRouter.snapshot.queryParams.backUrl ||
      this.router.url;
  }

  public userIsAuthorize(): boolean {
    return this.authService.isAuthorize();
  }

  public signOut(): void {
    this.authService.signOut();
  }
}
