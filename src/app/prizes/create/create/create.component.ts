import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/api/authentication-service.service';
import { ProfileApiService } from 'src/app/user/profile/api/profile-api.service';
import { User } from 'src/app/user/profile/models/user';
import { MinOneWeek } from 'src/app/utils/expiry_data_validator';
import { CreatePrizeService } from '../api/create-prize.service';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * CreateComponent - Componente responsável pela criação de prêmios.
 *
 * Propriedades:
 * - `user`: Armazena informações sobre o usuário logado.
 * - `today`: Armazena a data atual.
 * - `dd, mm, yyyy`: Representam o dia, mês e ano da data atual, respectivamente.
 * - `minDate`: Representa a data mínima para expiração do prêmio.
 * - `prize`: FormGroup que contém o formulário para criar o prêmio.
 * - `categorys`: Lista das categorias disponíveis para os prêmios.
 * - `e400`: Indica se ocorreu um erro 400 durante a requisição.
 * - `prizeCreated`: Indica se o prêmio foi criado com sucesso.
 *
 * Métodos:
 * - `ngOnInit()`: Método de inicialização do componente. Obtém o usuário, categorias e inicializa a formação do formulário.
 * - `subscribeForms()`: Inscreve-se em mudanças do formulário para verificar erros.
 * - `submit()`: Envia o formulário para criar um novo prêmio.
 * - `cleanData()`: Limpa dados após a criação do prêmio.
 *
 * Dependências:
 * - `profileApi`: Serviço para obter informações do usuário.
 * - `api`: Serviço de autenticação.
 * - `formBuilder`: Utilizado para criar instâncias FormGroup.
 * - `apiCreatePrize`: Serviço para criar prêmios.
 *
 * Este componente é utilizado principalmente para interagir com o usuário e permitir a criação de novos prêmios. Também gerencia erros e feedback.
 */
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
    public profileApi: ProfileApiService,
    private api: AuthenticationService,
    private formBuilder: FormBuilder,
    public apiCreatePrize: CreatePrizeService
  ) {}

  ngOnInit(): void {
    this.profileApi.loading = true;
    this.profileApi.getUser().subscribe({
      next: (data: User) => {
        if (data) {
          this.user = data;
          this.profileApi.loading = false;
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
    this.today.setDate(this.today.getDate() + 7);

    this.dd = String(this.today.getDate()).padStart(2, '0');
    this.mm = String(this.today.getMonth() + 1).padStart(2, '0');
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
    this.apiCreatePrize.loading = true;
    this.apiCreatePrize
      .createPrize(this.prize.getRawValue())
      .subscribe({
        next: (data) => {
          this.prizeCreated = true;
          this.apiCreatePrize.loading = false;
        },
        error: (e) => {
          this.apiCreatePrize.loading = false;
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
