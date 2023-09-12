import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CpfValidator } from 'src/app/utils/cpf_validator';
import { CepValidator } from 'src/app/utils/cep_validator';
import { ProfileApiService } from '../api/profile-api.service';
import { User } from '../models/user';
import { Subscription, filter, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserDataApiService } from './api/user-data-api.service';
import { CepModel } from '../models/cep';
import { PhonePipe } from 'src/app/utils/pipe/phone/phone.pipe';
/**
 * DataComponent
 *
 * Um componente responsável por exibir e editar os dados do usuário.
 *
 * Propriedades:
 *
 * - `profile`: FormGroup que contém o formulário de dados.
 * - `userGet`: Um booleano para determinar se os dados do usuário foram buscados.
 * - `userEditing`: Um booleano para determinar se o usuário está atualmente editando os dados.
 * - `isPartner`: Um booleano para determinar se o usuário é um parceiro.
 * - `emailInvalid`: Indica se o e-mail inserido é inválido.
 * - `numberInvalid`: Indica se o número inserido é inválido.
 * - `saveDisabler`: Usado para desativar o botão de salvar durante certas operações.
 * - `cepSubscription`: Uma assinatura para observar as mudanças no controle 'cep' do formulário.
 * - `selectedFile`: O arquivo selecionado pelo usuário (para imagem de perfil).
 * - `estados`: Uma lista dos estados brasileiros.
 *
 * Métodos:
 *
 * - `subscribeForms()`: Inscreve-se para mudanças no controle 'cep' do formulário.
 * - `handleCepError()`: Lida com o erro se 'cep' for inválido.
 * - `updateProfileWithCepData(data: any)`: Atualiza o formulário de perfil com os dados CEP recebidos.
 * - `setValueAndDisable(controlName: string, value: any)`: Define o valor de um controle do formulário e o desativa.
 * - `patchForm(data: User)`: Aplica os dados do usuário no formulário de perfil.
 * - `onFileChange(event)`: Atualiza o `selectedFile` quando o usuário seleciona um arquivo.
 * - `edit()`: Permite que o usuário edite seu perfil.
 * - `save()`: Envia os dados editados do usuário para o servidor.
 * - `cancel()`: Cancela o processo de edição e redefine o formulário.
 *
 * Dependências:
 * - `formBuilder`: Serviço FormBuilder para criar instâncias de FormGroup e FormControl.
 * - `profileApi`: Serviço ProfileApiService para obter os dados do usuário.
 * - `http`: Serviço HttpClient para fazer requisições HTTP.
 * - `apiPatchUser`: Serviço UserDataApiService para atualizar os dados do usuário.
 * - `phone`: PhonePipe para formatar números de telefone.
 *
 * Este componente é responsável por gerenciar os dados do usuário. Ele pode exibir o perfil do usuário, permitir que o usuário
 * edite seus dados e salvar os dados editados de volta para o servidor. O formulário também possui validadores para garantir que
 * o usuário insira dados válidos. O componente busca os dados do usuário na inicialização e também oferece recursos para fazer
 * o upload de uma imagem de perfil e validar o código postal brasileiro (CEP) usando um serviço externo.
 */
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  profile!: FormGroup;
  userGet: boolean = false;
  userEditing: boolean = false;
  isPartner: boolean = false;

  emailInvalid: boolean = false;
  numberInvalid: boolean = false;

  saveDisabler: boolean = false;

  private cepSubscription: Subscription;
  selectedFile: File = null;

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
    public profileApi: ProfileApiService,
    private http: HttpClient,
    public apiPatchUser: UserDataApiService,
    private phone: PhonePipe
  ) {
    this.profile = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required]],
      empresa: [''],
      sobrenome: ['', [Validators.required]],
      cpf: ['', [Validators.required, CpfValidator.cpf]],
      cnpj: [''],
      cep: ['', [Validators.required, CepValidator.cep]],
      rua: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      foto: [''],
      contato_email: ['', Validators.email],
      contato_numero: [''],
      descricao: [''],
    });
    this.profile.disable();
  }

  ngOnInit(): void {
    this.profileApi.userData$.subscribe({
      next: (data) => {
        if (data) {
          this.isPartner = data.is_partner;
          this.patchForm(data);
        }
      },
    });
  }

  subscribeForms(): void {
    this.cepSubscription = this.profile
      .get('cep')
      ?.valueChanges.pipe(
        filter(() => this.profile.get('cep')?.valid),
        switchMap((valor) =>
          this.http.get<any>(`https://viacep.com.br/ws/${valor}/json/`)
        )
      )
      .subscribe((data: CepModel) => {
        if (data.erro) {
          this.handleCepError();
          return;
        }
        this.updateProfileWithCepData(data);
      });
  }

  handleCepError() {
    this.profile.get('cep')?.setErrors({ incorrect: true });
    this.setValueAndDisable('rua', '');
    this.setValueAndDisable('cidade', '');
    this.setValueAndDisable('uf', '');
  }

  updateProfileWithCepData(data: any) {
    if (data?.localidade) {
      this.setValueAndDisable('cidade', data?.localidade);
    } else {
      this.profile.get('cidade').enable();
    }

    if (data?.logradouro) {
      this.setValueAndDisable('rua', data?.logradouro);
    } else {
      this.profile.get('rua').enable();
    }

    if (data?.uf) {
      this.setValueAndDisable('uf', data?.uf);
    } else {
      this.profile.get('uf').enable();
    }
  }

  setValueAndDisable(controlName: string, value: any) {
    const control = this.profile.get(controlName);
    control?.setValue(value, { emitEvent: false });
    control?.disable();
    control?.updateValueAndValidity({ emitEvent: false });
  }

  patchForm(data: User) {
    this.profile.patchValue({
      email: data.email,
      nome: data.first_name,
      sobrenome: data.last_name,
      cpf: data.cpf,
      cep: data.cep,
      cnpj: data.cnpj,
      cidade: data.address_city,
      uf: data.address_state,
      rua: data.address_street,
      empresa: data.partner_company_name,
      contato_numero: this.phone.transform(data.partner_number_contact),
      contato_email: data.partner_email_contact,
      descricao: data.partner_company_description,
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  edit() {
    this.userEditing = true;
    this.profile.enable();
    this.profile.get(['email']).disable();
    if (this.isPartner) {
      this.profile.disable();
      this.profile.get(['nome']).enable();
      this.profile.get(['contato_email']).enable();
      this.profile.get(['contato_numero']).enable();
      this.profile.get(['foto']).enable();
      this.profile.get(['descricao']).enable();
    }
    this.subscribeForms();
  }

  save() {
    if (this.profile.valid) {
      this.saveDisabler = true;
      this.apiPatchUser
        .updateUserData(
          this.profile.getRawValue(),
          this.selectedFile,
          this.isPartner
        )
        .subscribe({
          next: (data: User) => {
            this.cepSubscription.unsubscribe();
            this.apiPatchUser.postRequest = false;
            this.apiPatchUser.isLoading = false;
            this.emailInvalid = false;
            this.numberInvalid = false;
            this.profileApi.userDataSubject.next(data);
            this.userEditing = false;
            this.profile.disable();
            this.saveDisabler = false;
          },
          error: (e: HttpErrorResponse) => {
            this.saveDisabler = false;
            this.apiPatchUser.isLoading = false;
            if (e.status === 400) {
              if (e.error.email_contact) {
                this.emailInvalid = true;
              }
              if (e.error.number_contact) {
                this.numberInvalid = true;
              }
            }
            if (e.status === 401) {
              console.error('Token inválido e Refresh Token inválidos');
            }
          },
          complete: () => {},
        });
    }
  }

  cancel() {
    this.userEditing = false;
    this.profile.disable();
  }
}
