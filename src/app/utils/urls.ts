export class Urls {
  // baseUrl: string = 'http://192.168.0.125:8000';
  baseUrl: string = 'http://127.0.0.1:8000';

  verifyUrl: string = this.baseUrl + '/accounts/token/verify/';
  refreshUrl: string = this.baseUrl + '/accounts/token/refresh/';
  logoutUrl: string = this.baseUrl + '/accounts/logout/';
  searchUrl: string = this.baseUrl + '/turistic-points/?search=';
  historyUrl: string = this.baseUrl + '/history/';
  locationUrl: string = this.baseUrl + '/locais/';
  prizeUrl: string = this.baseUrl + '/premios/';
  redeemUrl: string = this.baseUrl + '/resgatar/';
  userUrl: string = this.baseUrl + '/accounts/user/';
  postUrl: string = this.baseUrl + '/accounts/user/';
  registerUrl: string = this.baseUrl + '/accounts/registration/';
  verifyEmailUrl: string =
    this.baseUrl + '/accounts/registration/verify-email/';
  loginUrl: string = this.baseUrl + '/accounts/login/';
  resendUrl: string = this.baseUrl + '/accounts/registration/resend-email/';
  redeemedUrl: string = this.baseUrl + '/resgatar/';
  qrCodeUrl: string = this.baseUrl + '/qr-code/?prize=';
  partnerPrizes: string = this.baseUrl + '/resgatar-cupons-criados/';
  prizeCategory: string = this.baseUrl + '/premios-categoria/';
}
