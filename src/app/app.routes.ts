import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {GamificationComponent} from "./gamification/gamification.component";

export const routes: Routes = [{path: 'dashboard', component: DashboardComponent},{path: 'game', component: GamificationComponent}, {path: 'profile', component: DashboardComponent}];
