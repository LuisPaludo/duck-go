import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginApiService } from './api/login-api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentication-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login!: FormGroup;

  buttonDisable: boolean = false;
  verifyEmail: boolean = false;
  incorrect: boolean = false;
  success: boolean = false;
  resend: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiLogin: LoginApiService,
    private api: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.login?.valid) {
      this.buttonDisable = true;
      this.apiLogin.Login(this.login.value).subscribe({
        next: (data) => {
          this.handleLoginSuccess(data);
        },
        error: (e) => {
          this.buttonDisable = false;
          this.verifyEmail = false;
          this.incorrect = false;
          if (e.error.email) {
            this.login.get('email')?.setErrors({ incorrect: true });
          }
          if (
            e.error.non_field_errors ==
            'Unable to log in with provided credentials.'
          ) {
            this.login.get('password')?.setErrors({ incorrect: true });
            this.incorrect = true;
          }
          if (e.error.non_field_errors == 'E-mail is not verified.') {
            this.verifyEmail = true;
          }
        },
        complete: () => {
          this.handleLoginComplete();
        },
      });
    } else {
      this.login.markAllAsTouched();
    }
  }

  private handleLoginSuccess(data: any) {
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('isVerified', 'true');
    this.api.isPartner.next(data.user.is_partner);
    if (data.user.is_partner) {
      localStorage.setItem('isPartner', 'true');
    }
  }

  private handleLoginComplete() {
    this.login.disable();
    this.buttonDisable = true;
    this.verifyEmail = false;
    this.incorrect = false;
    this.success = true;
    this.api.currentToken.next(localStorage.getItem('token'));
    this.api.isAuthenticated.subscribe({
      next: (isVerified) => {
        if (isVerified) {
          setTimeout(() => {
            this.router.navigate(['']);
          }, 1000);
        }
      },
    });
  }

  redirect() {
    this.resend = true;
    this.router.navigate(['/login/reenviar']);
  }
}
