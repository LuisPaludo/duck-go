import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { ProfileApiService } from '../../api/profile-api.service';
import { userPatchModel } from '../../models/userPatchModel';
import { User } from '../../models/user';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class UserDataApiService {

  private urls:Urls = new Urls();

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

  updateUserData(data:userPatchModel, selectedFile:File, isPartner:boolean):Observable<any> {

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

    if(isPartner) {
      formData.append('partner_company_name', data.empresa);
      formData.append('partner_email_contact', data.contato_email);
      formData.append('partner_number_contact', data.contato_numero);
      formData.append('partner_company_description', data.descricao);
    }

    if (data.foto) {
      formData.append('profile_photo', selectedFile, selectedFile.name);
    }

    return this.http
      .patch(this.urls.user, formData)
  }
}
