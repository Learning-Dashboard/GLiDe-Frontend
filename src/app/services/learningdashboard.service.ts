import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LearningdashboardService {

  private backUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getLeaderboard(id: number){
    return this.http.get(this.backUrl + '/leaderboards/' + id);
  }

  getLeaderboardResults(id: number){
    return this.http.get(this.backUrl + '/leaderboards/' + id + '/results');
  }

  getMetrics(project: string) {
    let params = new HttpParams()
      .set('prj', project);
    return this.http.get(this.backUrl + '/metrics/students', {params: params});
  }

  getProjectMetrics(project: string) {
    let params = new HttpParams()
      .set('prj', project);
    return this.http.get(this.backUrl + '/metrics/current', {params: params});
  }

  getMetricsHistory(project: string, fromDate: string, toDate: string) {
    let params = new HttpParams()
      .set('prj', project)
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.backUrl + '/metrics/students/historical', {params: params});
  }

  getProjectMetricsHistory(project: string, fromDate: string, toDate: string) {
    let params = new HttpParams()
      .set('prj', project)
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.backUrl + '/metrics/historical', {params: params});
  }

  getProjectCategories(project: string) {
    let params = new HttpParams()
      .set('prj', project);
    return this.http.get(this.backUrl + '/metrics', {params: params});
  }

  getAllCategories() {
    return this.http.get(this.backUrl + '/metrics/categories');
  }

  getPlayerGamification(player_name: string) {
    return this.http.get(this.backUrl + '/players/' + player_name + '/gamification');
  }

  getSelectedMetrics(player_name: string) {
    return this.http.get(this.backUrl + '/players/' + player_name + '/monitoring');
  }

  updateSelectedMetrics(player_name: string, metricsString: string, metricsHistoryString: string, metricsBarString: string) {
    let params = new HttpParams()
      .set('selectedMetrics', metricsString)
      .set('selectedHistoryMetrics', metricsHistoryString)
      .set('selectedBarMetrics', metricsBarString);
    return this.http.patch(this.backUrl + '/players/' + player_name + '/monitoring/selectedMetrics', params);
  }

  getUsers() {
    return this.http.get(this.backUrl + '/players/individuals');
  }

  getIndividualPlayer(player_name: string) {
    return this.http.get(this.backUrl + '/gamification/players/individuals/' + player_name);
  }

  getTeamPlayer(player_name: string) {
    return this.http.get(this.backUrl + '/gamification/players/teams/' + player_name);
  }

  getPlayerAchievements(player_name: string, attained: string, category: string){
    let params = new HttpParams()
      .set('attained', attained)
      .set('category', category);
    return this.http.get(this.backUrl + '/gamification/players/' + player_name + '/achievements', {params: params});
  }
}
