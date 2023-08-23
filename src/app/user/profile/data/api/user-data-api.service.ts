import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { ProfileApiService } from '../../api/profile-api.service';
import { userPatchModel } from '../../models/userPatchModel';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserDataApiService {
  private postUrl: string = 'http://127.0.0.1:8000/accounts/user/';

  verified: boolean = false;
  isLoading: boolean = false;
  postData: userPatchModel;
  postRequest: boolean = false;

  postCache: FormData;
  fileCache: any;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private profileApi: ProfileApiService
  ) {}

  updateUserData(data:userPatchModel, selectedFile:File):void {

    if (this.isLoading) {
      return;
    }

    this.postRequest = true;
    this.isLoading = true;

    const accessToken: string = localStorage.getItem('token');
    const VerifiedHttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
    });

    const formData: FormData = new FormData();

    formData.append('first_name', data.nome);
    formData.append('last_name', data.sobrenome);
    formData.append('email', data.email);
    formData.append('username', this.profileApi.user.username);
    formData.append('cep', data.cep);
    formData.append('cpf', data.cpf);
    formData.append('addres_rua', data.rua);
    formData.append('address_UF', data.uf);
    formData.append('address_cidade', data.cidade);
    formData.append('data_nascimento', this.profileApi.user.data_nascimento);

    if (data.foto) {
      formData.append('profile_photo', selectedFile, selectedFile.name);
    }

    this.http
      .put(this.postUrl, formData, {
        headers: VerifiedHttpHeaders,
      })
      .subscribe({
        next: (data:User) => {
          console.info("Dados do usuário atualizados, chamando função para pegar os dados do servidor")
          this.postRequest = false;
          this.isLoading = false;
          this.profileApi.userDataSubject.next(data);
        },
        error: (e) => {
          this.isLoading = false;
          if (e.status === 400) {
            console.error('Dados enviados incorretos ' )
          }
          if (e.status === 401) {
          } else {
            console.error('Token inválido e Refresh Token inválidos');
          }
        },
        complete: () => {

        }
      });
  }
}
