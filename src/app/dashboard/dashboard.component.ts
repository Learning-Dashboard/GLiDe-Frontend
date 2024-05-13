import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {LearningdashboardService} from "../services/learningdashboard.service";
import Chart from "chart.js/auto";
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 2 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  chart: any = [];
  result : any;
  metrics : any;
  dates: any;
  chartDom: any;
  myChart: any;
  myChart2: any;
  //option: any;

  constructor(private service: LearningdashboardService) {}

  ngOnInit() {
    this.service.getHistoricalClosedTasksWithAE().subscribe((res) => {
      this.result = res;
      this.metrics = this.result.map((item: any) => item.value);
      this.dates = this.result.map((item: any) => item.date);

      console.log(this.result);
      console.log(this.metrics);
      console.log(this.dates); /*

      /* not this
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
      this.myChart2 = echarts.init(document.getElementById('main2'));

      this.myChart2.setOption({
        title: {
          text: 'ECharts Getting Started Example'
        },
        tooltip: {},
        xAxis: {
          data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
        },
        yAxis: {},
        series: [
          {
            name: 'sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
      */

    type EChartsOption = echarts.EChartsOption;

    this.chartDom = document.getElementById('main')!;
    this.myChart = echarts.init(this.chartDom);
    let option: EChartsOption;

    option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.33, '#FF6E76'],
                [0.66, '#FDDD60'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            rotate: 'tangential',
            formatter: function (value: number) {
              if (value === 0.99) {
                return 'Grade A';
              } else if (value === 0.625) {
                return 'Grade B';
              } else if (value === 0.375) {
                return 'Grade C';
              } else if (value === 0.125) {
                return 'Grade D';
              }
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value: number) {
              return Math.round(value * 100) + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: 0.65,
              name: 'Metric'
            }
          ]
        }
      ]
    };

    option && this.myChart.setOption(option);


  }
}
