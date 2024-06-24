import { Component, OnDestroy, OnInit, Signal, ViewChild, signal } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormRegisterSalesComponent } from './form-registerSales/form-registerSales.component';
import ISale from '@shared/interfaces/IRegisterSale';
import { RegisterSaleService } from '@modules/services/registerSale.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';
import ITableColumn from '@shared/interfaces/ITableColumn';


@Component({
  standalone: true,
  imports: [MatSidenavModule, DynamicTableComponent, FormRegisterSalesComponent],
  selector: 'app-registerSales',
  templateUrl: './registerSales.component.html',
  styleUrls: ['./registerSales.component.scss']
})
export class RegisterSalesComponent implements OnInit {

 
  @ViewChild("form") formComponent?: FormRegisterSalesComponent;
  @ViewChild("dynamicTable") dynamicTable?: DynamicTableComponent;
  @ViewChild("sidebar") sidebar?: MatDrawer;
  destroyed$:Subject<void> = new Subject<void>();

  formOption: string = "";
  itemToUpdate!: ISale;
  array = signal([] as Array<ISale>)

  constructor(private registerSaleService: RegisterSaleService) { }

  ngOnInit() {
    this.getAll();
  }


  setCreateItem() {
    this.formOption = "create";
    this.sidebar?.toggle();
  }

  getAll() {
    this.registerSaleService.getAll();
    this.registerSaleService.getArray().subscribe({
      next: (sales: Array<any>) => {
        this.array.set([...sales]);
        this.setColumnsToTable();
        this.setDataToTable(this.array());
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
  }

  setDataToTable(array: Signal<ISale> | Array<any>) {
    this.dynamicTable?.setDataToTable(array);
  }

  setColumnsToTable() {

    let columns: Array<ITableColumn> = [
      { name: "select", viewValue: "", sortable: false, sticky: true },
      { name: "consecutive", viewValue: "Consecutivo", sortable: true, sticky: true },
      { name: "orderDate", viewValue: "Fecha", sortable: false, sticky: true , isDate:true},
      { name: "totalAmount", viewValue: "Total", sortable: true, sticky: false, isCurrency:true},
      { name: "clientName", viewValue: "Cliente", sortable: false, sticky: false },
      { name: "clientCardId", viewValue: "Cedula", sortable: false, sticky: false },
    ];
    this.dynamicTable?.setDisplayedColumns(columns);
  }

  createItem(sale: ISale) {
    Swal.fire({toast: true, position: "top-end", title: "Creando", showConfirmButton: false, timer:2000, didOpen: () => Swal.showLoading()})
    this.registerSaleService.create(sale).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
        console.log(result);
          this.formComponent?.resetForm();
          this.sidebar?.toggle();
        // }
      },
      error: (error: any) => {

      }
    })
  }



  deleteItem(sale: Array<ISale>) {
    let salesToDelete = sale.length == 1 ? [sale[0].orderID] : sale.map((sales: ISale) => sales.orderID)
    
    this.registerSaleService.delete(salesToDelete).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
        this.dynamicTable?.clearSelection();
      },
      error: (error: any) => {
      }
    })
  }

  cancel() {
    this.sidebar?.toggle();
    this.formOption = "";
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
  }


}
