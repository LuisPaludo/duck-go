import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProfileApiService } from '../../api/profile-api.service';
import { userPatchModel } from '../../models/userPatchModel';
import { Urls } from 'src/app/utils/urls';
/**
 * UserDataApiService - Serviço responsável por gerenciar ações de atualização de dados do usuário.
 *
 * Propriedades:
 * - `urls`: Uma instância da classe Urls para manter as URLs usadas para chamadas à API.
 * - `verified`: Um indicador booleano se os dados do usuário foram verificados.
 * - `isLoading`: Um indicador booleano representando o estado de carregamento da chamada da API.
 * - `postData`: Uma instância do `userPatchModel` contendo os dados do usuário a serem atualizados.
 * - `postRequest`: Um indicador booleano representando o estado da solicitação de envio.
 * - `postCache`: Cache para FormData.
 * - `fileCache`: Cache para o arquivo de perfil do usuário.
 *
 * Métodos:
 * - `updateUserData(data:userPatchModel, selectedFile:File, isPartner:boolean)`: Realiza uma solicitação HTTP PATCH para
 * atualizar os dados do usuário. Retorna um observable da resposta.
 *
 * Dependências:
 * - `http`: Serviço HttpClient do Angular para fazer chamadas à API.
 * - `profileApi`: Serviço para gerenciar os dados de perfil do usuário.
 *
 * O `UserDataApiService` é responsável por atualizar os dados do usuário no backend. O método updateUserData prepara o
 * FormData com base nos dados do usuário fornecidos e parâmetros adicionais, e faz uma solicitação HTTP PATCH para o backend.
 */
@Injectable({
  providedIn: 'root',
})
export class UserDataApiService {
  private urls: Urls = new Urls();

  verified: boolean = false;
  isLoading: boolean = false;
  postData: userPatchModel;
  postRequest: boolean = false;

  postCache: FormData;
  fileCache: any;

  constructor(
    private http: HttpClient,
    private profileApi: ProfileApiService
  ) {}

  updateUserData(
    data: userPatchModel,
    selectedFile: File,
    isPartner: boolean
  ): Observable<any> {
    if (this.isLoading) {
      return of(false);
    }

    this.postRequest = true;
    this.isLoading = true;

    const accessToken: string = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('first_name', data.nome);
    formData.append('last_name', data.sobrenome);
    formData.append('email', data.email);
    formData.append('username', this.profileApi.user.username);
    formData.append('cep', data.cep);
    formData.append('cpf', data.cpf);
    formData.append('address_street', data.rua);
    formData.append('address_state', data.uf);
    formData.append('address_city', data.cidade);
    formData.append('birth_date', this.profileApi.user.birth_date);

    if (isPartner) {
      formData.append('partner_company_name', data.empresa);
      formData.append('partner_email_contact', data.contato_email);
      formData.append('partner_number_contact', data.contato_numero);
      formData.append('partner_company_description', data.descricao);
    }

    if (data.foto) {
      formData.append('profile_photo', selectedFile, selectedFile.name);
    }

    return this.http.patch(this.urls.user, formData);
  }
}
