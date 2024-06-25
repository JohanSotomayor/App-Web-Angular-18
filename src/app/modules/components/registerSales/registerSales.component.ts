import { Component, OnDestroy, OnInit, Signal, ViewChild, signal } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormRegisterSalesComponent } from './form-registerSales/form-registerSales.component';
import ISale from '@shared/interfaces/IRegisterSale';
import ITableColumn from '@shared/interfaces/ITableColumn';
import IOrderDetail from '@shared/interfaces/IOrderDetails';
import { RegisterSaleService } from '@modules/services/registerSale.service';
import { OrderDetailService } from '@modules/services/orderDetails.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';


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
  registerProducts:boolean =false;
  orderCurrent:number =0;
  orderSelect?:ISale;

  constructor(private registerSaleService: RegisterSaleService, private orderDetailService: OrderDetailService) { }

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
      { name: "detail", viewValue: "Detalle", sortable: false, sticky: false, isDetail:true },
    ];
    this.dynamicTable?.setDisplayedColumns(columns);
  }

  createItem(sale: ISale) {
    Swal.fire({toast: true, position: "top-end", title: "Creando", showConfirmButton: false, timer:2000, didOpen: () => Swal.showLoading()})
    this.registerSaleService.create(sale).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
        console.log('result',result);
          this.orderCurrent = result.data.orderID
          this.formComponent?.disabledForm();
          this.registerProducts = true

          // this.sidebar?.toggle();
        // }
      },
      error: (error: any) => {

      }
    })
  }


  createOrderDetail(orderD: Array<IOrderDetail>) {

    
    orderD.map((order:IOrderDetail) => {
        order['orderID']= this.orderCurrent
      })

    Swal.fire({toast: true, position: "top-end", title: "Creando", showConfirmButton: false, timer:2000, didOpen: () => Swal.showLoading()})
    this.orderDetailService.create(orderD).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
          this.formComponent?.resetForm();
          this.registerProducts = true
          this.sidebar?.toggle();
        
      },
      error: (error: any) => {

      }
    })
  }

  openDetail(orderD:ISale){

    this.orderSelect = orderD
    let id = orderD.orderID
    this.registerSaleService.getOrder(id!);
    this.registerSaleService.getArrayOrder().subscribe({
      next: (sale: ISale) => {
        
        this.orderSelect = sale;
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
    this.formOption = "detail";
    this.sidebar?.toggle();
  }

  searchDate(date:Date){
    this.registerSaleService.getSearchDate(date!);
    this.registerSaleService.getArrayOrder().subscribe({
      next: (sale: ISale) => {
        
        this.orderSelect = sale;
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });

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
