import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {ListDataSource, ListItem} from './list-datasource';
import {LearningdashboardService} from "../services/learningdashboard.service";
import {DomSanitizer} from "@angular/platform-browser";
import { Input } from '@angular/core';

class Badge {
  name: string | undefined;
  icon: string | undefined;
  date: string | undefined;
  units: number | undefined;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
})
export class ListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ListItem>;

  @Input() item : Badge[] = [];

  dataSource : any = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['icon', 'name', 'units', 'date'];

  constructor(private service: LearningdashboardService, private sanitizer: DomSanitizer) {  }

  ngOnInit() {
    this.dataSource = new ListDataSource(this.item);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
