import { Routes } from '@angular/router';
import {MonitoringtabsComponent} from "./monitoringTabs/monitoringtabs.component";
import {GamificationtabsComponent} from "./gamificationTabs/gamificationtabs.component";
import {UserComponent} from "./user/user.component";
import {LoginComponent} from "./login/login.component";
import {LoginAuthService} from "./services/loginAuth.service";
import {ProfileAuthService} from "./services/profileAuth.service";
import {NoAuthService} from "./services/noAuth.service";

export const routes: Routes = [
  {path: 'monitoring', component: MonitoringtabsComponent, canActivate: [LoginAuthService, ProfileAuthService]},
  {path: 'gamification', component: GamificationtabsComponent, canActivate: [LoginAuthService, ProfileAuthService]},
  {path: 'profile', component: UserComponent, canActivate: [LoginAuthService]},
  {path: 'login', component: LoginComponent, canActivate: [NoAuthService]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
