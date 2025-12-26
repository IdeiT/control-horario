import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;
  siteKey = environment.recaptchaSiteKey;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      recaptchaToken: ['', Validators.required]
    });
  }

  onRecaptchaResolved(token: any): void {
    if (token && typeof token === 'string') {
      this.loginForm.patchValue({ recaptchaToken: token });
    } else {
      this.loginForm.patchValue({ recaptchaToken: '' });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = '⚠️ Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.successMessage = '✅ Login exitoso. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.mensaje || '❌ Error en el login';
        // Resetear reCAPTCHA
        this.loginForm.patchValue({ recaptchaToken: '' });
      }
    });
  }
}

