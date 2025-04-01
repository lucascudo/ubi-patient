import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordConfirmationValidator } from '../../validators/password-confirmation.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  protected readonly registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordConfirmation: new FormControl('', [Validators.required]),
  }, { validators: passwordConfirmationValidator });
  protected registrationError = false;

  logInWithGoogle() {
    this.authService.logInWithGoogle();
  }
  
  registerWithEmailAndPassword(email: string, password: string) {
    this.authService.createUser(email, password, (reason: any) => {
      this.registrationError = true;
      throw Error(reason);
    });
  }
}
