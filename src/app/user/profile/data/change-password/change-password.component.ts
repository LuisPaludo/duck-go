import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidator } from 'src/app/utils/password_validator';
import { UserDataApiService } from '../api/user-data-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  change!: FormGroup;
  changing: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiUserData:UserDataApiService) {}

  ngOnInit(): void {
    this.change = this.formBuilder.group({
      old: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
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

    this.subscribeForms();
  }

  cancel(): void {
    this.router.navigate(['perfil/dados']);
  }

  changePassword(): void {
    if (this.change.valid) {
      this.changing = true;
      this.apiUserData.changePassword(this.change.getRawValue()).subscribe({
        next: (data) => {
          console.log(data)
          this.changing = false;
        },
        error: (e) => {
          console.log(e)
          this.changing = false;
        }
      })
    } else {
      this.change.markAllAsTouched();
    }
  }

  subscribeForms(): void {
    this.change.get('repeat')?.valueChanges.subscribe((valor) => {
      let senha = this.change.get('new').value;
      if (valor != senha) {
        this.change.get('repeat')?.setErrors({ incorrect: true });
        return;
      }
    });
  }
}
