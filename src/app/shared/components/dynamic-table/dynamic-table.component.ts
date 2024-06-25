import { SelectionModel } from '@angular/cdk/collections';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule,CurrencyPipe,DatePipe, TitleCasePipe} from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import ITableColumn from '@shared/interfaces/ITableColumn';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'dynamic-table',
  imports: [CommonModule,FormsModule, MatTableModule,MatDatepickerModule, MatIconModule,MatSortModule, MatPaginatorModule, MatButtonModule, MatCheckboxModule, MatInputModule, CdkDropList, CdkDrag, DatePipe, TitleCasePipe,CurrencyPipe],
  providers:[provideNativeDateAdapter()],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit, AfterViewInit {
  @Input("header") header: string = "";
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output("setCreateEvent") setCreateEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output("setUpdateEvent") setUpdateEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output("setDeleteEvent") setDeleteEvent: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  @Output("openDetailEvent") openDetailEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output("searchDateEvent") searchDateEvent: EventEmitter<any> = new EventEmitter<any>();
  
  columns: Array<ITableColumn> = [];
  displayedColumns: Array<string> = [];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  dateSearch: string = ''

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setDataToTable(array: Signal<any> | Array<any>) {
    if(Array.isArray(array)) {
      this.dataSource.data = array;
    } else {
      this.dataSource.data = array();
    }
  }

  setDisplayedColumns(columns: Array<ITableColumn>) {
    this.columns = columns;
    this.displayedColumns = columns.map((item: ITableColumn) => item.name);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setCreateItem() {
    this.setCreateEvent.emit();
  }

  setUpdateItem() {
    this.setUpdateEvent.emit(this.selection.selected[0]);
  }

  searchDate(){
    console.log(this.dateSearch)
    let date = new Date(this.dateSearch)
    let newDate = date.toISOString().split('T')[0];
    console.log(newDate)
    this.searchDateEvent.emit(newDate);
  }

  openDetail(element:any) {
    
    this.openDetailEvent.emit(element);
  }

  setDeleteItem() {
    Swal.fire({
      icon: "warning",
      title: "Eliminar registros",
      html: `Se eliminarán ${this.selection.selected.length} registros. <br> Esta acción es irreversible, ¿quieres eliminarlos de todas formas?`,
      showConfirmButton: true,
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e0301e"
    }).then((result: SweetAlertResult) => {
      if(result.isConfirmed) {
        this.setDeleteEvent.emit(this.selection.selected);
      }
    })
  }

  clearSelection() {
    this.selection.clear();
  }

}
