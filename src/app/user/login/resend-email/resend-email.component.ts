import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginApiService } from '../api/login-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.css'],
})
export class ResendEmailComponent implements OnInit {
  resend!: FormGroup;

  sendEmail: boolean = false;
  resendIncorrect: boolean = false;
  resendSuccess: boolean = false;
  buttonSend: boolean = false;
  buttonBack: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiLogin: LoginApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resend = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  send() {
    if (this.resend?.valid) {
      this.buttonSend = true;
      this.buttonBack = true;
      this.apiLogin.resendEmail(this.resend.getRawValue()).subscribe({
        next: () => {
          this.resendSuccess = true;
          this.buttonBack = false;
        },
      });
    } else {
      this.resend.markAllAsTouched();
    }
  }

  redirect() {
    this.router.navigate(['/login']);
  }
}
