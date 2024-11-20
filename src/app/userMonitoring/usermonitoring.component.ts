import {Component, ElementRef} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {LearningdashboardService} from "../services/learningdashboard.service";
import Chart from "chart.js/auto";
import * as echarts from 'echarts';
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";
import {EChartsOption} from "echarts";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, ɵValue} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from "@angular/material/input";
import {JsonPipe} from '@angular/common';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {forkJoin, switchMap} from "rxjs";

@Component({
  selector: 'app-usermonitoring',
  templateUrl: './usermonitoring.component.html',
  styleUrl: './usermonitoring.component.css',
  standalone: true,
  providers: [provideNativeDateAdapter(), [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]],
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDivider,
    MatTooltip,
    FormsModule,
    NgIf,
    MatFormField,
    MatSelect,
    ReactiveFormsModule,
    MatOption, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInput, NgForOf, MatFormFieldModule, MatDatepickerModule, JsonPipe, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, CdkDrag, CdkDropList
  ]
})

export class UsermonitoringComponent {

  private metricsId = ["assignedtasks", "closedtasks", "modifiedlines", "commits"];
  protected items = ['Tasks', 'Closed tasks', 'Modified lines', 'Commits'];

  private history_metrics_result : any;
  private result_categories: any = [];

  private lineCharts: any = [];

  protected map_current_metrics = new Map<string, number>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private endDate: any;
  private startDate: any;

  private result_metrics: any = [];

  private current_metrics: any = [];
  private current_categories: any = [];
  private notInitial: boolean = true;
  private allCategories: any = [];

  private project_name: any;
  private user_name: any;
  private user_name_Taiga: any;
  private user_name_GitHub: any;
  private player_name: any;

  private chartDomTasks: any;
  private chartDomClosedTasks: any;
  private chartDomModifiedLines: any;
  private chartDomCommits: any;

  private gaugeChartTasks: any;
  private gaugeChartClosedTasks: any;
  private gaugeChartModifiedLines: any;
  private gaugeChartCommits: any;

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    console.log('DROPPED');
    console.log(this.items);
  }

  constructor(private service: LearningdashboardService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.project_name = localStorage.getItem("project");
    this.user_name = localStorage.getItem("username");
    this.user_name_Taiga = localStorage.getItem("taigaUsername");
    this.user_name_GitHub = localStorage.getItem("githubUsername");
    this.player_name = localStorage.getItem("individualPlayername");

    window.addEventListener("resize", () => {
      this.gaugeChartTasks.resize();
      this.gaugeChartClosedTasks.resize();
      this.gaugeChartModifiedLines.resize();
      this.gaugeChartCommits.resize();

      const optionTasks = this.changeOption(this.current_metrics[0], this.current_categories[0]);
      this.gaugeChartTasks.setOption(optionTasks);
      const optionClosedTasks = this.changeOption(this.current_metrics[1], this.current_categories[1]);
      this.gaugeChartClosedTasks.setOption(optionClosedTasks);
      const optionModifiedLines = this.changeOption(this.current_metrics[2], this.current_categories[2]);
      this.gaugeChartModifiedLines.setOption(optionModifiedLines);
      const optionCommits = this.changeOption(this.current_metrics[3], this.current_categories[3]);
      this.gaugeChartCommits.setOption(optionCommits);
    });

    this.notInitial = true;

    this.service.getSelectedMetrics(this.player_name).pipe(switchMap(result => {
      this.setSelectedRange(result);
      this.setDates();
      return forkJoin({
        historyMetrics: this.service.getMetricsHistory(this.project_name, this.startDate, this.endDate),
        allCategories: this.service.getAllCategories()
      });
    }),
    switchMap(({historyMetrics, allCategories}) => {
      this.allCategories = allCategories;
      this.historyMetricsSubscriber(historyMetrics);
      return this.service.getProjectCategories(this.project_name);
    }),
    switchMap(result => {
      this.result_categories = result;
      let metricsWithCategories = this.result_categories?.map((item: any) => ({externalId: item.externalId, categoryName: item.categoryName}));
      let categoryName : any;
      for (let metric in this.metricsId) {
        if (this.metricsId[metric] == "assignedtasks" || this.metricsId[metric] == "closedtasks") categoryName = metricsWithCategories.find((x: { externalId: string}) => x.externalId === this.metricsId[metric] + '_' + this.user_name_Taiga).categoryName;
        if (this.metricsId[metric] == "modifiedlines" || this.metricsId[metric] == "commits") categoryName = metricsWithCategories.find((x: { externalId: string}) => x.externalId === this.metricsId[metric] + '_' + this.user_name_GitHub).categoryName;
        let categoryInformation = this.categoryInformation(categoryName);
        this.current_categories.push(categoryInformation);
      }
      return this.service.getMetrics(this.project_name);
    })).subscribe(res => {
      this.result_metrics = res;
      let metrics = [];
      let student_name: string;
      let metric_id: string;
      let totalTasks: number = 100;

      let labelsTasks: any = [];
      let dataTasks: any = [];

      let labelsClosedTasks: any = [];
      let dataClosedTasks: any = [];

      let labelsModifiedLines: any = [];
      let dataModifiedLines: any = [];

      let labelsCommits: any = [];
      let dataCommits: any = [];

      for (let student in this.result_metrics) {
        student_name = this.result_metrics[student].name;
        metrics = this.result_metrics[student].metrics;

        let user_metrics_id = metrics.map((item: any) => ({id: item.id, value: item.value}));

        for (let metric in metrics) {
          metric_id = this.result_metrics[student].metrics[metric].id;
          metric_id = metric_id.substring(0, metric_id.indexOf('_'));
          let metric_value;
          if (metric_id == 'assignedtasks') {
            metric_value = this.result_metrics[student].metrics[metric].value*100;
            dataTasks.push(metric_value);
            if (this.result_metrics[student].name == this.user_name) this.map_current_metrics.set("Tasks", Math.round(metric_value * 100) / 100);
            totalTasks = totalTasks - this.result_metrics[student].metrics[metric].value*100;
            labelsTasks.push(student_name);
          }
          else if (metric_id == 'closedtasks') {
            metric_value = this.result_metrics[student].metrics[metric].value*100;
            dataClosedTasks.push(metric_value);
            if (this.result_metrics[student].name == this.user_name) this.map_current_metrics.set("Closed tasks", Math.round(metric_value * 100) / 100);
            labelsClosedTasks.push(student_name);
          }
          else if (metric_id == 'modifiedlines') {
            metric_value = this.result_metrics[student].metrics[metric].value*100;
            dataModifiedLines.push(metric_value);
            if (this.result_metrics[student].name == this.user_name) this.map_current_metrics.set("Modified lines", Math.round(metric_value * 100) / 100);
            labelsModifiedLines.push(student_name);
          }
          else if (metric_id == 'commits') {
            metric_value = this.result_metrics[student].metrics[metric].value*100;
            dataCommits.push(metric_value);
            if (this.result_metrics[student].name == this.user_name) this.map_current_metrics.set("Commits", Math.round(metric_value * 100) / 100);
            labelsCommits.push(student_name);
          }
        }

        if (this.result_metrics[student].name == this.user_name) {
          this.current_metrics.push(user_metrics_id.find((x: { id: string}) => x.id === 'assignedtasks_'+this.user_name_Taiga).value);
          this.current_metrics.push(user_metrics_id.find((x: { id: string}) => x.id === 'closedtasks_'+this.user_name_Taiga).value);
          this.current_metrics.push(user_metrics_id.find((x: { id: string}) => x.id === 'modifiedlines_'+this.user_name_GitHub).value);
          this.current_metrics.push(user_metrics_id.find((x: { id: string}) => x.id === 'commits_'+this.user_name_GitHub).value);
        }
      }

      dataTasks.push(totalTasks);
      labelsTasks.push('Unassigned tasks');

      this.updateCharts();
      this.pieChart(this.items[0], labelsTasks, dataTasks);
      this.radarChart(this.items[1], labelsClosedTasks, dataClosedTasks);
      this.pieChart(this.items[2], labelsModifiedLines, dataModifiedLines);
      this.pieChart(this.items[3], labelsCommits, dataCommits);
    });
  }

  private setSelectedRange(result: any) {
    this.range.value.end = new Date(result.endDate);
    this.range.value.start = new Date(result.startDate);
    this.range = new FormGroup({
      start: new FormControl(this.range.value.start),
      end: new FormControl(this.range.value.end)
    });
  }

  private changeOption(value: number, categories: any[]) {
    let option: EChartsOption;
    return option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', 50 + Math.min(window.innerWidth/75, 25) + '%'],
          radius: '100%',
          min: 0,
          max: 1,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 3,
              color: categories
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: (window.innerWidth)/100,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'black'
            }
          },
          axisTick: {
            length: (window.innerWidth)/160,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: (window.innerWidth)/100,
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
            offsetCenter: [0, '-5%'],
            fontSize: (window.innerWidth)/110
          },
          detail: {
            fontSize: (window.innerWidth)/60,
            offsetCenter: [0, '-25%'],
            valueAnimation: true,
            formatter: function (value: number) {
              let value_format = value * 100;
              value_format = Math.round(value_format * 100) / 100;
              return value_format + '%';
            },
            color: 'black'
          },
          data: [
            {
              value: value,
              name: this.user_name
            }
          ]
        }
      ]
    };
  }

  private updateCharts() {
    this.chartDomTasks = document.getElementById('gaugeChart_' + this.items[0])!;
    this.gaugeChartTasks = echarts.init(this.chartDomTasks);
    const optionTasks = this.changeOption(this.current_metrics[0], this.current_categories[0]);
    optionTasks && this.gaugeChartTasks.setOption(optionTasks);

    this.chartDomClosedTasks = document.getElementById('gaugeChart_' + this.items[1])!;
    this.gaugeChartClosedTasks = echarts.init(this.chartDomClosedTasks);
    const optionClosedTasks = this.changeOption(this.current_metrics[1], this.current_categories[1]);
    optionClosedTasks && this.gaugeChartClosedTasks.setOption(optionClosedTasks);

    this.chartDomModifiedLines = document.getElementById('gaugeChart_' + this.items[2])!;
    this.gaugeChartModifiedLines = echarts.init(this.chartDomModifiedLines);
    const optionModifiedLines = this.changeOption(this.current_metrics[2], this.current_categories[2]);
    optionModifiedLines && this.gaugeChartModifiedLines.setOption(optionModifiedLines);

    this.chartDomCommits = document.getElementById('gaugeChart_' + this.items[3])!;
    this.gaugeChartCommits = echarts.init(this.chartDomCommits);
    const optionCommits = this.changeOption(this.current_metrics[3], this.current_categories[3]);
    optionCommits && this.gaugeChartCommits.setOption(optionCommits);
  }

  pieChart(id: string, labels: any, data: any) {
    return new Chart('pieChart_' + id, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left',
          },
        },
      },
    });
  }

  radarChart(id: string, labels: any, data: any) {
    return new Chart('pieChart_' + id, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            data: data
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
      },
    });
  }

  lineChart(id: string, labels: any, data: any) {
    return new Chart('lineChart_' + id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: data,
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      },
    })
  }

  filterDates() {
    if (this.range.value.end != null && this.range.value.start != null) {
      this.setDates();
      this.service.updateSelectedDates(this.player_name, this.startDate, this.endDate).subscribe((res) => {});
      this.service.getMetricsHistory(this.project_name, this.startDate, this.endDate).subscribe((res) => this.historyMetricsSubscriber(res));
    }
  }

  setDates(){
    this.endDate = this.range.value.end;
    this.endDate.setMinutes(this.endDate.getMinutes() - this.endDate.getTimezoneOffset())
    this.endDate = this.endDate.toJSON().substring(0,10);

    this.startDate = this.range.value.start;
    this.startDate.setMinutes(this.startDate.getMinutes() - this.startDate.getTimezoneOffset())
    this.startDate = this.startDate.toJSON().substring(0,10);
  }

  historyMetricsSubscriber(res:any){
    this.history_metrics_result = res;

    this.history_metrics_result = res;
    let metrics = [];
    let student_name: string;
    let metric_id: string;
    let student_it = 0;

    let labels: any[] = [];
    let datasets: any = [];

    let labelsTasksHistory = [];
    let labelsClosedTasksHistory = [];
    let labelsModifiedLinesHistory = [];
    let labelsCommitsHistory = [];

    let dataTasksHistory = [];
    let dataClosedTasksHistory = [];
    let dataModifiedLinesHistory = [];
    let dataCommitsHistory = [];

    for (let student in this.history_metrics_result) {
      student_name = this.history_metrics_result[student].name;
      metrics = this.history_metrics_result[student].metrics;
      if (this.history_metrics_result[student].name != null) {
        let dataTasksHistoryStudent = [];
        let dataClosedTasksHistoryStudent = [];
        let dataModifiedLinesHistoryStudent = [];
        let dataCommitsHistoryStudent = [];
        for (let metric in metrics) {
          metric_id = this.history_metrics_result[student].metrics[metric].id;
          metric_id = metric_id.substring(0, metric_id.indexOf('_'));
          if (metric_id == 'assignedtasks') {
            dataTasksHistoryStudent.push(this.history_metrics_result[student].metrics[metric].value * 100);
            if (this.history_metrics_result[student].name == this.user_name) labelsTasksHistory.push(this.history_metrics_result[student].metrics[metric].date.split("-").reverse().join("-"));
          } else if (metric_id == 'closedtasks') {
            dataClosedTasksHistoryStudent.push(this.history_metrics_result[student].metrics[metric].value * 100);
            if (this.history_metrics_result[student].name == this.user_name) labelsClosedTasksHistory.push(this.history_metrics_result[student].metrics[metric].date.split("-").reverse().join("-"));
          } else if (metric_id == 'modifiedlines') {
            dataModifiedLinesHistoryStudent.push(this.history_metrics_result[student].metrics[metric].value * 100);
            if (this.history_metrics_result[student].name == this.user_name) labelsModifiedLinesHistory.push(this.history_metrics_result[student].metrics[metric].date.split("-").reverse().join("-"));
          } else if (metric_id == 'commits') {
            dataCommitsHistoryStudent.push(this.history_metrics_result[student].metrics[metric].value * 100);
            if (this.history_metrics_result[student].name == this.user_name) labelsCommitsHistory.push(this.history_metrics_result[student].metrics[metric].date.split("-").reverse().join("-"));
          }
        }
        dataTasksHistory.push({label: this.history_metrics_result[student].name, data: dataTasksHistoryStudent.reverse()});
        dataClosedTasksHistory.push({label: this.history_metrics_result[student].name, data: dataClosedTasksHistoryStudent.reverse()});
        dataModifiedLinesHistory.push({label: this.history_metrics_result[student].name, data: dataModifiedLinesHistoryStudent.reverse()});
        dataCommitsHistory.push({label: this.history_metrics_result[student].name, data: dataCommitsHistoryStudent.reverse()});
      }
      student_it += 1;
    }
    labels.push(labelsTasksHistory, labelsClosedTasksHistory, labelsModifiedLinesHistory, labelsCommitsHistory);
    datasets.push(dataTasksHistory, dataClosedTasksHistory, dataModifiedLinesHistory, dataCommitsHistory);
    this.updateLineCharts(labels, datasets);
  }

  updateLineCharts(labels: any[], datasets: any[]){
    if (this.notInitial) {
      this.notInitial = false;
      this.lineCharts.push(this.lineChart(this.items[0], labels[0].reverse(), datasets[0]));
      this.lineCharts.push(this.lineChart(this.items[1], labels[1].reverse(), datasets[1]));
      this.lineCharts.push(this.lineChart(this.items[2], labels[2].reverse(), datasets[2]));
      this.lineCharts.push(this.lineChart(this.items[3], labels[3].reverse(), datasets[3]));
    }
    else {
      let it = 0;
      for (let lineChart in this.lineCharts) {
        this.lineCharts[lineChart].data.labels.pop();
        this.lineCharts[lineChart].data.datasets.data = [];
        this.lineCharts[lineChart].update();

        this.lineCharts[lineChart].data.labels = labels[it].reverse();
        this.lineCharts[lineChart].data.datasets = datasets[it];
        this.lineCharts[lineChart].update();
        it += 1;
      }
    }
  }

  categoryInformation(categoryName: string):(string | number)[][] {
    let categoryInformation: any = [];
    for (let category in this.allCategories) {
      if (this.allCategories[category].name == categoryName) {
        categoryInformation.push([this.allCategories[category].upperThreshold, this.allCategories[category].color]);
      }
    }
    categoryInformation = categoryInformation.reverse();
    return categoryInformation;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  }
}
