import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterApiService } from './api/register-api.service';

import { CpfValidator } from 'src/app/utils/cpf_validator';
import { CepValidator } from 'src/app/utils/cep_validator';
import { usernameValidator } from 'src/app/utils/username_validator';
import { passwordValidator } from 'src/app/utils/password_validator';

/**
 * RegisterComponent - Componente responsável pelo registro de usuários.
 *
 * Propriedades:
 * - `form`: FormGroup que contém os controles para o formulário de registro.
 * - `isDisabled`: Um indicador para controlar o estado desativado dos elementos do formulário.
 * - `verifyEmailSent`: Um indicador para notificar que um email de verificação foi enviado.
 * - `emailAlreadyRegistered`: Um indicador para notificar se o email inserido já está registrado.
 * - `usernameAlreadyRegistered`: Um indicador para notificar se o nome de usuário inserido já está registrado.
 * - `buttonDisable`: Um indicador para controlar o estado do botão de envio.
 * - `showTerms`: Um indicador para alternar a exibição dos termos e condições.
 * - `estados`: Uma lista dos estados brasileiros com suas abreviações e nomes completos.
 *
 * Métodos:
 * - `ngOnInit()`: Inicializa o formulário com todas as validações necessárias e inicia a assinatura dos controles do formulário.
 * - `subscribeForms()`: Assina mudanças em certos controles do formulário, como 'cep' e 'confSenha'.
 * - `salvar()`: Verifica a validade do formulário e potencialmente salva os dados (placeholder no momento).
 * - `onSubmit()`: Valida o formulário e envia os dados para a API. Lida com a resposta para fornecer feedback ao usuário.
 * - `termsandconditions()`: Exibe os termos e condições.
 * - `accept()`: Aceita os termos e condições e marca a caixa de seleção associada.
 * - `recuse()`: Recusa os termos e condições e desmarca a caixa de seleção associada.
 *
 * Dependências:
 * - `formBuilder`: Serviço Angular para criar formulários reativos.
 * - `http`: Serviço Angular para fazer solicitações HTTP.
 * - `router`: Serviço de roteamento Angular para navegar entre componentes/páginas.
 * - `api`: Serviço que facilita a comunicação com a API de registro de usuário.
 *
 * Vários validadores são importados para garantir a validade da entrada do usuário:
 * - `CpfValidator`: Validador para o CPF brasileiro.
 * - `SelectValidator`: Validador para seleções em dropdown.
 * - `NumberValidator`: Validador para entradas numéricas.
 * - `CepValidator`: Validador para o CEP brasileiro.
 * - `usernameValidator`: Validador para nomes de usuário.
 * - `passwordValidator`: Validador para senhas.
 *
 * Este componente permite que os usuários se registrem preenchendo um formulário. Comunica-se com serviços externos (por exemplo, ViaCEP)
 * para preencher automaticamente certos campos com base no CEP inserido. Também se comunica com o backend para registrar o usuário
 * e fornece feedback com base no sucesso ou falha do registro.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isDisabled: boolean = true;
  verifyEmailSent: boolean = false;
  emailAlreadyRegistered: boolean = false;
  usernameAlreadyRegistered: boolean = false;
  buttonDisable: boolean = false;
  showTerms: boolean = false;

  estados: { sigla: string; nome: string }[] = [
    { sigla: '', nome: '' },
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'TO', nome: 'Tocantins' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private api: RegisterApiService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, usernameValidator.username]],
      nome: ['', [Validators.required]],
      sobrenome: ['', [Validators.required]],
      senha: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
      confSenha: ['', Validators.required],
      cpf: ['', [Validators.required, CpfValidator.cpf]],
      cep: ['', [Validators.required, CepValidator.cep]],
      rua: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required]],
      termos: ['', Validators.requiredTrue],
    });

    this.subscribeForms();
    this.form.controls['cidade'].disable();
    this.form.controls['rua'].disable();
    this.form.controls['uf'].disable();
  }

  subscribeForms(): void {
    this.form.get('cep')?.valueChanges.subscribe((valor) => {
      if (this.form.get('cep')?.valid) {
        this.http
          .get<any>('https://viacep.com.br/ws/' + valor + '/json/')
          .subscribe((data) => {
            if (data.erro) {
              this.form.get('cep')?.setErrors({ incorrect: true });
              this.form.get('rua').setValue('', {
                emitEvent: false,
              });
              this.form.get('cidade').setValue('', {
                emitEvent: false,
              });
              this.form.get('uf').setValue('', {
                emitEvent: false,
              });
              this.form.controls['cidade'].disable();
              this.form.controls['rua'].disable();
              this.form.controls['uf'].disable();
              return;
            }

            this.form.controls['cidade'].enable();
            this.form.controls['rua'].enable();
            this.form.controls['uf'].enable();

            if (data?.localidade) {
              this.form.get('cidade').setValue(data?.localidade, {
                emitEvent: false,
              });
              this.form.controls['cidade'].disable();
              this.form.get('cidade')?.updateValueAndValidity({
                emitEvent: false,
              });
            }

            if (data?.logradouro) {
              this.form.get('rua').setValue(data?.logradouro, {
                emitEvent: false,
              });
              this.form.controls['rua'].disable();
              this.form.get('rua')?.updateValueAndValidity({
                emitEvent: false,
              });
            }

            if (data?.uf) {
              let estadoEncontrado = this.estados.find(
                (estado) => estado.sigla === data?.uf
              );
              this.form
                .get('uf')
                .setValue(this.estados.indexOf(estadoEncontrado), {
                  emitEvent: false,
                });
              this.form.controls['uf'].disable();
            }
          });
      }
    });

    this.form.get('confSenha')?.valueChanges.subscribe((valor) => {
      let senha = this.form.get('senha').value;
      if (valor != senha) {
        this.form.get('confSenha')?.setErrors({ incorrect: true });
        return;
      }
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
    }
  }

  onSubmit() {
    if (this.form?.valid) {
      this.buttonDisable = true;
      this.api.registerNewUser(this.form.getRawValue()).subscribe({
        error: (e) => {
          this.buttonDisable = false;
          this.emailAlreadyRegistered = false;
          this.usernameAlreadyRegistered = false;
          if (e.error.email) {
            this.emailAlreadyRegistered = true;
            this.form.get('email')?.setErrors({ incorrect: true });
          }
          if (e.error.username) {
            this.usernameAlreadyRegistered = true;
            this.form.get('username')?.setErrors({ incorrect: true });
          }
        },
        complete: () => {
          this.verifyEmailSent = true;
          this.emailAlreadyRegistered = false;
          this.usernameAlreadyRegistered = false;
          this.form.disable();
          this.buttonDisable = true;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        },
      });
    }
  }

  termsandconditions() {
    this.showTerms = true;
  }

  accept() {
    this.showTerms = false;
    this.form.get('termos').setValue(true, {
      emitEvent: false,
    });
  }

  recuse() {
    this.showTerms = false;
    this.form.get('termos').setValue(false, {
      emitEvent: false,
    });
  }
}
