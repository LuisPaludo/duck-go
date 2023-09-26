import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { passwordValidator } from 'src/app/utils/password_validator';
import { LoginApiService } from '../../api/login-api.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  uidb64: string;
  token: string;
  hasError: boolean = false;
  changing: boolean = false;
  success:boolean = false;

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiLogin: LoginApiService
  ) {}

  ngOnInit(): void {
    this.uidb64 = atob(this.route.snapshot.paramMap.get('uidb64'));
    this.token = this.route.snapshot.paramMap.get('token');

    this.form = this.formBuilder.group({
      new: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
      repeat: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
    });
  }

  resetConfirm(): void {
    if (this.form.valid) {
      this.changing = true;
      this.apiLogin
        .resetConfirm(this.form.getRawValue(), this.uidb64, this.token)
        .subscribe({
          next: (data) => {
            this.success = true;
          },
          error: (e) => {
            this.changing = false;
            this.hasError = true;
          },
        });
    }
  }
}
