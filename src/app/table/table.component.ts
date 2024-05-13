import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatTableModule, MatTable, MatTableDataSource} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import {LearningdashboardService} from "../services/learningdashboard.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBar]
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableItem>;
  dataSource : any = [];

  //Test
  data: any = [];
  example: TableItem[] = [];
  example2: TableItem[] = [];
  result: Object = [];
  public position = 0;
  public data2 : any = null;
  maxPoints: any;



  constructor(private service: LearningdashboardService) {  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['position', 'name', 'points'];

  ngOnInit() {
    this.service.getLeaderboard(1).subscribe((res) => {
      this.result = res;
      this.data = res;
      this.position = 0;

      for (let a in this.data) {
        this.position = this.position + 1;
        if (this.position == 1) this.maxPoints = this.data[a].points;
        let percent = (this.data[a].points / this.maxPoints) * 100;
        this.example.push({name: this.data[a].name, points: this.data[a].points, position: this.position, percent: percent});
      }
      this.data = this.example;

      this.example.forEach((element: { name: any; }) => {
        this.example2.push({name: element.name, points: 0, position: 1, percent: 100});
      });

      this.dataSource = new TableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    })

  }

  ngAfterViewInit(): void {
    this.dataSource = new TableDataSource(this.data);
    //this.dataSource = new TableDataSource(this.service);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;


  }
}
