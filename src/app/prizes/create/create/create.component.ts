import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/api/authentication-service.service';
import { ProfileApiService } from 'src/app/user/profile/api/profile-api.service';
import { User } from 'src/app/user/profile/models/user';
import { MinOneWeek } from 'src/app/utils/expiry_data_validator';
import { CreatePrizeService } from '../api/create-prize.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  public user: User;
  public today: Date;
  public dd: number | string;
  public mm: number | string;
  public yyyy: number;

  public minDate: string;

  public prize: FormGroup;

  public categorys: any[];
  public e400: boolean = false;

  public prizeCreated: boolean = false;

  constructor(
    private profileApi: ProfileApiService,
    private api: AuthenticationService,
    private formBuilder: FormBuilder,
    private apiCreatePrize: CreatePrizeService
  ) {}

  ngOnInit(): void {
    this.profileApi.getUser().subscribe({
      next: (data: User) => {
        if (data) {
          this.user = data;
        }
      },
    });

    this.apiCreatePrize.getCategory().subscribe({
      next: (data) => {
        if (data) {
          this.categorys = data;
        }
      },
    });

    this.today = new Date();
    // Adicione 7 dias à data atual
    this.today.setDate(this.today.getDate() + 7);

    this.dd = String(this.today.getDate()).padStart(2, '0');
    this.mm = String(this.today.getMonth() + 1).padStart(2, '0'); // Os meses são 0 indexados, então Janeiro = 0, Fevereiro = 1, etc.
    this.yyyy = this.today.getFullYear();

    this.minDate = `${this.yyyy}-${this.mm}-${this.dd}`;

    this.prize = this.formBuilder.group({
      nome: ['', [Validators.required]],
      pontos: [
        '',
        [Validators.min(100), Validators.max(1000), Validators.required],
      ],
      unidades: [
        '',
        [Validators.min(1), Validators.max(3000), Validators.required],
      ],
      expiracao: ['', [Validators.required, MinOneWeek.minOneWeek]],
      descricao: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
    });

    this.subscribeForms();
  }

  subscribeForms(): void {

    this.prize.get('nome')?.valueChanges.subscribe(() => {
      if (this.prize.get('nome').valid) {
        this.e400 = false;
        return;
      }
    });
  }

  submit() {
    if (this.prize.invalid) {
      this.prize.markAllAsTouched();
      return;
    }

    this.apiCreatePrize
      .createPrize(this.prize.getRawValue(), this.user.profile_photo)
      .subscribe({
        next: (data) => (this.prizeCreated = true),
        error: (e) => {
          if (e instanceof HttpErrorResponse && e.status === 400) {
            this.e400 = true;
            this.prize.get('nome')?.setErrors({ incorrect: true });
          }
        },
      });
  }

  cleanData() {
    // this.e400 = false;
  }
}
