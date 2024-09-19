import { Routes } from '@angular/router';
import {MonitoringtabsComponent} from "./monitoringTabs/monitoringtabs.component";
import {GamificationtabsComponent} from "./gamificationTabs/gamificationtabs.component";
import {UserComponent} from "./user/user.component";

export const routes: Routes = [{path: 'monitoring', component: MonitoringtabsComponent},{path: 'gamification', component: GamificationtabsComponent},{path: 'profile', component: UserComponent}];
