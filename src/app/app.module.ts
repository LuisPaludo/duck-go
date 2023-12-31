import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HowtoplayComponent } from './howtoplay/howtoplay.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './user/profile/profile.component';
import { DataComponent } from './user/profile/data/data.component';
import { HistoryComponent } from './user/profile/history/history.component';
import { LocationsComponent } from './locations/locations.component';
import { ResendEmailComponent } from './user/login/resend-email/resend-email.component';
import { TokenInterceptor } from './interceptor/token-interceptor.interceptor';
import { VerifyEmailComponent } from './user/register/verify-email/verify-email.component';
import { PrizesComponent } from './prizes/prizes.component';
import { PhonePipe } from './utils/pipe/phone/phone.pipe';
import { PartnerGuideComponent } from './partner-guide/partner-guide.component';
import { CreateComponent } from './prizes/create/create/create.component';
import { PartnerComponent } from './partner/partner/partner.component';
import { NotFoundComponent } from './notFound/not-found/not-found.component';
import { UserPrizesComponent } from './user/profile/user-prizes/user-prizes.component';
import { LocationComponent } from './locations/location/location.component';
import { ChangePasswordComponent } from './user/profile/data/change-password/change-password.component';
import { ResetComponent } from './user/login/reset/reset.component';
import { ConfirmComponent } from './user/login/reset/confirm/confirm.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowtoplayComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    DataComponent,
    HistoryComponent,
    LocationsComponent,
    ResendEmailComponent,
    VerifyEmailComponent,
    PrizesComponent,
    PhonePipe,
    PartnerGuideComponent,
    CreateComponent,
    PartnerComponent,
    NotFoundComponent,
    UserPrizesComponent,
    LocationComponent,
    ChangePasswordComponent,
    ResetComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    PhonePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
