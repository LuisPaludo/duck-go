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
  resend!: FormGroup;

  buttonDisable: boolean = false;
  verifyEmail: boolean = false;
  incorrect: boolean = false;
  success: boolean = false;

  sendEmail: boolean = false;
  resendIncorrect: boolean = false;
  resendSuccess: boolean = false;
  buttonSend: boolean = false;
  buttonBack:boolean = false;

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

    this.resend = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
          console.log(e);
          this.verifyEmail = false;
          this.incorrect = false;
          if (e.error.email) {
            this.login.get('email')?.setErrors({ incorrect: true });
            console.log(e);
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
    localStorage.setItem('token', data.access );
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('isVerified', 'true' );
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
        if(isVerified){
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        }
      }
    });


  }

  redirect() {
    if(this.sendEmail) {
      this.sendEmail = false;
      this.verifyEmail = false;
    } else {
      this.sendEmail = true;
    }
      // this.login.markAsUntouched();
  }

  send() {

    if (this.resend?.valid) {
      this.buttonSend = true;
      this.buttonBack = true;
      this.apiLogin.resendEmail(this.resend.getRawValue()).subscribe({
        next: () => {
          console.log('Email Enviado com sucesso')
          this.resendSuccess = true;
          this.buttonBack = false;
        },
        error: (e) => {
          console.error('Erro -> ' + e)
        }
      })

    } else {
      this.resend.markAllAsTouched();
    }
  }
}
