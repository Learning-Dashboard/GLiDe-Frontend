import {Component, inject} from '@angular/core';
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
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerInputEvent, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker, MatEndDate, MatStartDate, MatDatepickerModule} from "@angular/material/datepicker";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatInput, MatInputModule} from "@angular/material/input";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

export interface DialogData {
  metrics: string[];
  historyMetrics: string[];
  barMetrics: string[];
}

@Component({
  selector: 'app-projectmonitoring',
  templateUrl: './projectmonitoring.component.html',
  styleUrl: './projectmonitoring.component.css',
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
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatStartDate,
    MatSuffix,
    NgForOf,
    ReactiveFormsModule,
    CdkDrag,
    CdkDropList,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatDialogModule,
    MatInput,
    MatDatepickerModule,
    NgIf
  ]
})
export class ProjectmonitoringComponent {

  protected selectedMetrics : string[] = [];
  protected selectedHistoryMetrics : string[] = [];
  protected selectedBarMetrics : string[] = [];

  private project_name: any;
  private player_name: any;

  private projectMetrics: any = [];
  private projectBarMetrics: any = [];

  private current_categories : any= [];
  private current_bar_categories : any= [];

  private chartDomTasks: any = [];
  private gaugeChartTasks: any = [];

  private endDate: any;
  private startDate: any;

  private dataHistory: any = [];
  private labelsHistory: any = [];

  protected range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private historyMetricsChart: any = [];
  private allCategories: any = [];
  protected progressBarInformation : any = [];

  constructor(private service: LearningdashboardService) {}

  ngOnInit() {

    this.project_name = localStorage.getItem("project");
    this.player_name = localStorage.getItem("individualPlayername");

    window.addEventListener("resize", () => {
      for (let gauge in this.gaugeChartTasks) {
        this.gaugeChartTasks[gauge].resize();
      }
    });

    this.range.value.end = new Date();
    this.range.value.start = new Date();
    this.range.value.start.setDate(this.range.value.end.getDate() - 7);
    this.range = new FormGroup({
        start: new FormControl(this.range.value.start),
        end: new FormControl(this.range.value.end)
      }
    );

    this.filterDates();

    this.getSelectedMetrics();
    this.getCategories();
    this.historyProjectMetrics();


  }

  private getSelectedMetrics() {
    this.service.getSelectedMetrics(this.player_name).subscribe((result) => {
      let result_categories: any = result;
      let metrics = result_categories.selectedMetrics;
      let historyMetrics = result_categories.selectedHistoryMetrics;
      let barMetrics = result_categories.selectedBarMetrics;
      let metricsArray = metrics.split(',');
      let historyMetricsArray = historyMetrics.split(',');
      let barMetricsArray = barMetrics.split(',');
      this.selectedMetrics = metricsArray.sort();
      this.selectedHistoryMetrics = historyMetricsArray.sort();
      this.selectedBarMetrics = barMetricsArray.sort();
    });
  }

  private updateSelectedMetrics(selectedMetrics: string[], selectedHistoryMetrics: string[], selectedBarMetrics: string[]) {
    let metricsString = selectedMetrics.toString();
    let metricsHistoryString = selectedHistoryMetrics.toString();
    let metricsBarString = selectedBarMetrics.toString();
    this.service.updateSelectedMetrics(this.player_name, metricsString, metricsHistoryString, metricsBarString).subscribe((result) => {});
  }

  private getCategories() {
    this.service.getAllCategories().subscribe((result) => {
      this.allCategories = result;
    });

    this.service.getProjectCategories(this.project_name).subscribe((result) => {
      let metricsWithCategories: any;
      metricsWithCategories = result;

      let categoryName : any;
      let categoryInformation : any;
      let current_categories : any= [];
      let current_bar_categories : any= [];

      for (let metric in this.selectedMetrics) {
        categoryName = metricsWithCategories.find((x: { externalId: string}) => x.externalId === this.selectedMetrics[metric]).categoryName;
        categoryInformation = this.categoryInformation(categoryName);
        current_categories.push(categoryInformation);
      }

      for (let metric in this.selectedBarMetrics) {
        categoryName = metricsWithCategories.find((x: { externalId: string}) => x.externalId === this.selectedBarMetrics[metric]).categoryName;
        categoryInformation = this.categoryInformation(categoryName);
        current_bar_categories.push(categoryInformation);
      }

      this.current_categories = current_categories;
      this.current_bar_categories = current_bar_categories;
      this.getMetrics();
    });
  }

  private categoryInformation(categoryName: string):(string | number)[][] {
    let categoryInformation: any = [];
    for (let category in this.allCategories) {
      if (this.allCategories[category].name == categoryName) {
        categoryInformation.push([this.allCategories[category].upperThreshold, this.allCategories[category].color]);
      }
    }
    categoryInformation = categoryInformation.reverse();
    return categoryInformation;
  }

  private getMetrics() {
    this.service.getProjectMetrics(this.project_name).subscribe((res) => {
      let result_project_metrics: any = res;
      this.projectMetrics = result_project_metrics.map((item: any) => ({id: item.id, name: item.name, value: item.value})).filter((item: any) => (this.selectedMetrics.includes(item.id)));
      this.projectBarMetrics = result_project_metrics.map((item: any) => ({id: item.id, name: item.name, value: item.value})).filter((item: any) => (this.selectedBarMetrics.includes(item.id)));
      this.updateGaugeCharts();
      this.progressBar();
    });
  }

  private updateGaugeCharts() {
    for (let metric in this.projectMetrics) {
      type EChartsOption = echarts.EChartsOption;
      this.chartDomTasks[metric] = document.getElementById('gaugeChart_' + this.projectMetrics[metric].id)!;
      this.gaugeChartTasks[metric] = echarts.init(this.chartDomTasks[metric]);
      const option = this.changeOption(this.projectMetrics[metric].value, this.current_categories[metric], this.projectMetrics[metric].id);
      option && this.gaugeChartTasks[metric].setOption(option, true);
    }
    for (let gauge in this.gaugeChartTasks) {
      this.gaugeChartTasks[gauge].resize();
    }
  }

  private progressBar() {
    let progressBarInformation : any = [];
    for (let current_category in this.projectBarMetrics) {
      let categories : any = this.current_bar_categories[current_category];
      let value_format = this.projectBarMetrics[current_category].value * 100;
      value_format = Math.round(value_format * 100) / 100;
      progressBarInformation.push([this.projectBarMetrics[current_category].id, categories, value_format]);
    }
    this.progressBarInformation = progressBarInformation;
  }

  private changeOption(value: number, categories: any[], id: string) {
    let option;
    return option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
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
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'black'
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
            fontSize: 0,
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
            fontSize: 10
          },
          detail: {
            fontSize: 35,
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
              name: ''
            }
          ]
        }
      ]
    };
  }

  private historyProjectMetrics(){
    this.service.getProjectMetricsHistory(this.project_name, this.startDate, this.endDate).subscribe((res) => {
      let result: any;
      result = res;
      this.dataHistory = [];
      this.labelsHistory = [];

      let metric_id : string;
      for (let metric in this.selectedHistoryMetrics) {
        metric_id = this.selectedHistoryMetrics[metric];
        let metric_values = result.map((item: any) => ({id: item.id, name: item.name, value: item.value, date: item.date})).filter((item: any) => (metric_id === item.id));
        let particularDataHistory: any = [];
        let particularLabelsHistory: any = [];
        for (let historyMetricValue in metric_values) {
          particularDataHistory.push(metric_values[historyMetricValue].value * 100);
          particularLabelsHistory.push(metric_values[historyMetricValue].date.split("-").reverse().join("-"));
        }
        this.dataHistory.push(particularDataHistory);
        this.labelsHistory.push(particularLabelsHistory);
      }
      this.createHistoryCharts();
    })
  }

  filterDates() {
    if (this.range.value.end != null && this.range.value.start != null) {
      this.endDate = this.range.value.end;
      this.endDate.setMinutes(this.endDate.getMinutes() - this.endDate.getTimezoneOffset())
      this.endDate = this.endDate.toJSON().substring(0,10);
      this.startDate = this.range.value.start;
      this.startDate.setMinutes(this.startDate.getMinutes() - this.startDate.getTimezoneOffset())
      this.startDate = this.startDate.toJSON().substring(0,10);
      this.historyProjectMetrics();
    }
  }

  private createHistoryCharts() {
    if (this.historyMetricsChart != null) {
      for (let chart in this.historyMetricsChart) {
        this.historyMetricsChart[chart].destroy();
      }
    }

    for (let metric in this.selectedHistoryMetrics) {
      let id = 'historyChart_'+ this.selectedHistoryMetrics[metric];
      let labels = this.labelsHistory[metric];
      let data = this.dataHistory[metric]

      this.historyMetricsChart[metric] = new Chart(id, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: this.project_name,
              data: data,
            }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        },
      })
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  }

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {metrics: this.selectedMetrics, historyMetrics: this.selectedHistoryMetrics, barMetrics: this.selectedBarMetrics},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.selectedMetrics = result.metrics;
        this.selectedHistoryMetrics = result.historyMetrics;
        this.selectedBarMetrics = result.barMetrics;
        this.updateSelectedMetrics(this.selectedMetrics, this.selectedHistoryMetrics, this.selectedBarMetrics);
        this.getCategories();
        for (let gauge in this.gaugeChartTasks) {
          this.gaugeChartTasks[gauge].resize();
        }
      }
    });
  }
}

@Component({
  selector: 'configuration-dialog',
  templateUrl: 'configuration-dialog.html',
  styleUrl: './projectmonitoring.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelect,
    MatOption,
    NgForOf,
  ],
})

export class DialogOverviewExampleDialog {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly selectedMetrics = this.data.metrics;
  readonly metrics: string[] = ["acceptance_criteria_check", "closed_tasks_with_AE", "commits_anonymous", "commits_sd", "commits_taskreference", "deviation_effort_estimation_simple", "pattern_check", "tasks_sd", "tasks_with_EE", "unassignedtasks"];

  onNoClick(): void {
    this.dialogRef.close();
  }
}
