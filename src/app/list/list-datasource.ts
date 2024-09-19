import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ListItem {
  id: number;
  icon: string;
  name: string;
  date: string;
  units: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ListItem[] = [
  {id: 1, icon: 'iVBORw0KGgoAAAANSUhEUgAAAGcAAABnCAYAAAAdQVz5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABBHSURBVHhe7Z35lx1FFcc5nuMP',
    name: 'Reached 90% of Tasks with Estimated Effort Information', date: '01/05/2024', units: 2},
  {id: 2, icon: 'iVBORw0KGgoAAAANSUhEUgAAAGcAAABnCAMAAAAqn6zLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALBUExURQAAAP',
    name: 'Reached 90% of Closed Tasks with Actual Effort Information', date: '01/05/2024', units: 1},
  {id: 3, icon: '',
    name: '', date: '-', units: 0},
];

/**
 * Data source for the List view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ListDataSource extends DataSource<ListItem> {
  data: ListItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(data: any) {
    super();
    this.data = data;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ListItem[]> {
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
  private getPagedData(data: ListItem[]): ListItem[] {
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
  private getSortedData(data: ListItem[]): ListItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'icon': return compare(+a.icon, +b.icon, isAsc);
        case 'date': return compare(+a.date, +b.date, isAsc);
        case 'units': return compare(+a.date, +b.date, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
