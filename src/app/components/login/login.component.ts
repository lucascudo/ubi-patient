import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async loginWithGoogle() {
    if (await this.authService.loginWithGoogle()) {
      this.router.navigateByUrl("/home-patient"); //TODO change this to different home page in case of different user roles
    }
  }
}
