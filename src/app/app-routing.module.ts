import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HowtoplayComponent } from './howtoplay/howtoplay.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DataComponent } from './user/profile/data/data.component';
import { HistoryComponent } from './user/profile/history/history.component';
import { LocationsComponent } from './locations/locations.component';
import { ResendEmailComponent } from './user/login/resend-email/resend-email.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { NegateAuthGuard } from './guard/negate-auth.guard';
import { VerifyEmailComponent } from './user/register/verify-email/verify-email.component';
import { PrizesComponent } from './prizes/prizes.component';
import { CupounsComponent } from './user/profile/cupouns/cupouns.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NegateAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NegateAuthGuard],
  },
  {
    path: 'como-jogar',
    component: HowtoplayComponent,
  },
  {
    path: 'perfil',
    component: ProfileComponent,
    children: [
      {
        path: 'dados',
        component: DataComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'historico',
        component: HistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'meus-cupons',
        component: CupounsComponent,
        canActivate: [AuthGuard]
      }
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'locais',
    component: LocationsComponent,
  },
  {
    path: 'reenviar-email-verificacao',
    component: ResendEmailComponent,
    canActivate: [NegateAuthGuard],
  },
  {
    path: 'verificacao-email/:key',
    component: VerifyEmailComponent,
    canActivate: [NegateAuthGuard],
  },
  {
    path: 'premios',
    component: PrizesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
