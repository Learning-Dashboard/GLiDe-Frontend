import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LearningdashboardService {
  private baseUrl = 'http://gessi-dashboard.essi.upc.edu:8888/api';

  private backUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getHistoricalClosedTasksWithAE(){
    return this.http.get(this.backUrl + '/metrics');
    //    return this.http.get(this.baseUrl + '/metrics/closed_tasks_with_AE/historical?prj=AMEP12QueryQueens&from=2024-03-01&to=2024-04-15');
  }

  getAchievements(){
    return this.http.get(this.backUrl + '/achievements');
  }

  getLeaderboard(number: number){
    return this.http.get(this.backUrl + '/leaderboards');
  }
}
