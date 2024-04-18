import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LearningdashboardService {
  private baseUrl = 'http://gessi-dashboard.essi.upc.edu:8888/api';

  constructor(private http: HttpClient) {}

  getHistoricalClosedTasksWithAE(){
    return this.http.get(this.baseUrl + '/metrics/closed_tasks_with_AE/historical?prj=AMEP12QueryQueens&from=2024-03-01&to=2024-04-15');
  }
}
