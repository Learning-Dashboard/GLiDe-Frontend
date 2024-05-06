import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatTableModule, MatTable, MatTableDataSource} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import {LearningdashboardService} from "../services/learningdashboard.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
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
  private position = 0;
  public data2 : any = null;


  constructor(private service: LearningdashboardService) {  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['position', 'name', 'points'];

  ngOnInit() {
    this.service.getAchievements().subscribe((res) => {
      this.result = res;
      this.data = res;
      this.position = 0;

      for (let a in this.data) {
        this.position = this.position + 1;
        this.example.push({name: this.data[a].name, points: 0, position: this.position});
      }

      this.data = this.example;

      this.example.forEach((element: { name: any; }) => {
        this.example2.push({name: element.name, points: 0, position: 0});
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
