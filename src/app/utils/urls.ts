export class Urls {
  // baseUrl: string = 'http://192.168.0.125:8000';
  // baseUrl: string = 'http://127.0.0.1:8000/';
  baseUrl: string = 'https://web-production-1c42.up.railway.app/';

  verify: string = this.baseUrl + 'accounts/token/verify/';
  refresh: string = this.baseUrl + 'accounts/token/refresh/';
  logout: string = this.baseUrl + 'accounts/logout/';

  locations: string = this.baseUrl + 'locais/';
  touristAttaction: string = this.baseUrl + 'pontos-turisticos/?search=';

  user: string = this.baseUrl + 'accounts/user/';
  history: string = this.baseUrl + 'usuario/historico/';
  register: string = this.baseUrl + 'accounts/registration/';
  verifyEmail: string = this.baseUrl + 'accounts/registration/verify-email/';
  resend: string = this.baseUrl + 'accounts/registration/resend-email/';
  login: string = this.baseUrl + 'accounts/login/';

  partner: string = this.baseUrl + 'parceiros/detalhes/';

  prize: string = this.baseUrl + 'premios/';
  redeem: string = this.baseUrl + 'resgatar/';

  prizeCategory: string = this.baseUrl + 'categorias/';
  partnerPrizes: string = this.baseUrl + 'criados/';
  recover: string = this.baseUrl + 'premios/usuarios/recuperar/';
  check: string = this.baseUrl + 'checar/';
  qrCode: string = this.baseUrl + 'premios/premio/qr-code/?prize=';

  changePassword: string = this.baseUrl + 'accounts/password/change/';
  resetPassword: string = this.baseUrl + 'accounts/password/reset/';
  reserPasswordConfirm: string =
    this.baseUrl + 'accounts/password/reset/confirm/';
}
