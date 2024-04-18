import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NavigationComponent} from "./navigation/navigation.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LearningdashboardService} from "./services/learningdashboard.service";
//import {Chart} from "chart.js";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, NavigationComponent, DashboardComponent],
  templateUrl: './app.component.html',
  //template: `<mat-slide-toggle>Toggle me!</mat-slide-toggle>`,
  //template: '<app-dashboard></app-dashboard>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GLiDe';
  chart: any = [];
  result : any;
  metrics : any;
  dates: any;
  constructor(private service: LearningdashboardService) {}

  ngOnInit() {
    this.service.getHistoricalClosedTasksWithAE().subscribe((res) => {
      this.result = res;
      this.metrics = this.result.map((item: any) => item.value);
      this.dates = this.result.map((item: any) => item.date);

      console.log(this.result);
      console.log(this.metrics);
      console.log(this.dates);
      /*
      let metricValues = [];
      this.result.forEach((item) => {
        metricValues.push(item.value) */

      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label: 'Historical Closed Tasks With AE',
              data: this.metrics
            },
          ],
        },
        options: {

        },
      });

    })

/*
      var metricValues2 = Object.keys(res).map(function(entryIndex){
        let entry = res[entryIndex];
        return entry.value;
      });
      let metricValues3= this.result.map((item: { value: any; }) => {
        return item.value
      });
      }
    );
    */

  }
}
