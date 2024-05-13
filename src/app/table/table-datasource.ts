import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import {LearningdashboardService} from "../services/learningdashboard.service";

// TODO: Replace this with your own data model type
export interface TableItem {
  position: number;
  name: string;
  points: number;
  percent: number;
}

// TODO: replace this with real data from your application
/*
const EXAMPLE_DATA: TableItem[] = [
  {position: 1, name: 'Hydrogen', points: 20},
  {position: 2, name: 'Helium', points: 20},
  {position: 3, name: 'Lithium', points: 20},
  {position: 4, name: 'Beryllium', points: 20},
  {position: 5, name: 'Boron', points: 20},
  {position: 6, name: 'Carbon', points: 20},
  {position: 7, name: 'Nitrogen', points: 20},
  {position: 8, name: 'Oxygen', points: 20},
  {position: 9, name: 'Fluorine', points: 20},
  {position: 10, name: 'Neon', points: 20},
  {position: 11, name: 'Sodium', points: 20},
  {position: 12, name: 'Magnesium', points: 20},
  {position: 13, name: 'Aluminum', points: 20},
  {position: 14, name: 'Silicon', points: 20},
  {position: 15, name: 'Phosphorus', points: 20},
  {position: 16, name: 'Sulfur', points: 20},
  {position: 17, name: 'Chlorine', points: 20},
  {position: 18, name: 'Argon', points: 20},
  {position: 19, name: 'Potassium', points: 20},
  {position: 20, name: 'Calcium', points: 20},
];
*/


/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableItem> {
  //data: TableItem[] = EXAMPLE_DATA;
  data: any = [];
  example: TableItem[] = [];
  example2: TableItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  result: Object = [];
  public position2 = 0;
  public data2 : any = null;

  /*
  constructor(private service: LearningdashboardService) {
    super();

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

    })

   */

  constructor(data3: any) {
    super();
    console.log(data3);
    this.data = data3;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TableItem[]): TableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableItem[]): TableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.position, +b.position, isAsc);
        case 'position': return compare(+a.position, +b.position, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
