import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState, AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink
  ]
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);

  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private router = inject(Router);
  protected readonly authState = authState(this.auth);
  protected readonly isLoggedIn = this.authState.pipe(map(u => !!u?.uid));
  protected readonly links = [
    {path: '/home-patient', label: 'Home'},
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  async logout() {
    return await this.authService.logout();
  }

  isActive(path: string) {
    return this.router.url.includes(path);
  }
}

