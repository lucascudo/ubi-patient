import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  async loginWithGoogle() {
    const user = (await this.authService.loginWithGoogle()).user;
    if (user.email) {
      const isProfessional = await this.userService.isUserProfessional(user.email);
      this.userService.logAuth(user, isProfessional);
      this.router.navigateByUrl(`/home-${ isProfessional ? "professional" : "patient" }`);
    }
  }
}
