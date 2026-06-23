import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TableRow = Record<string, string | number>;
export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right';
}

export interface SortChange {
  key: string;
  direction: SortDirection;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input({ required: true }) rows: TableRow[] = [];
  @Input({ required: true }) columns: DataTableColumn[] = [];
  @Input() sortKey = '';
  @Input() sortDirection: SortDirection = 'asc';
  @Input() emptyMessage = 'No records found.';

  @Output() sortChange = new EventEmitter<SortChange>();
  @Output() view = new EventEmitter<TableRow>();
  @Output() edit = new EventEmitter<TableRow>();
  @Output() remove = new EventEmitter<TableRow>();

  onSort(column: DataTableColumn): void {
    if (!column.sortable) {
      return;
    }

    const nextDirection: SortDirection =
      this.sortKey === column.key && this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({
      key: column.key,
      direction: nextDirection
    });
  }

  valueFor(row: TableRow, key: string): string | number {
    return row[key] ?? '-';
  }

  statusClass(value: string | number): string {
    return String(value).toLowerCase();
  }
}
