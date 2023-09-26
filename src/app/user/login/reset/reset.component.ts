import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginApiService } from '../api/login-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  reset!: FormGroup;

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
    this.reset = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  redirect() {
    this.router.navigate(['/login']);
  }

  send() {
    if (this.reset?.valid) {
      this.buttonSend = true;
      this.buttonBack = true;
      this.apiLogin.reset(this.reset.getRawValue()).subscribe({
        next: () => {
          this.resendSuccess = true;
          this.buttonBack = false;
        },
      });
    } else {
      this.reset.markAllAsTouched();
    }
  }
}
