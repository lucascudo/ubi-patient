import { Component, inject, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';


type Link = {
  path: string,
  label: string
}

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
export class AppComponent implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);

  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  protected readonly user$ = user(this.auth);
  private userSubscription: Subscription;
  protected links: Link[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor() {
    this.userSubscription = this.user$.subscribe(async (user) => {
      if (user?.email) {
        this.links = await this.userService.isUserProfessional(user.email) ? [
          {path: "/home-professional", label: "Início"},
        ] : [
          {path: "/home-patient", label: "Início"},
        ];
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  async logout() {
    return await this.authService.logout();
  }

  isActive(path: string) {
    return this.router.url.includes(path);
  }
}

